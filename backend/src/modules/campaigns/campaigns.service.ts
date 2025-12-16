import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Campaign, CampaignStatus } from './entities/campaign.entity';
import { CampaignDistribution } from './entities/campaign-distribution.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { MonthlyContribution } from '../monthly-contributions/entities/monthly-contribution.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { PaymentsService } from '../payments/payments.service';
import { MonthlyContributionsService } from '../monthly-contributions/monthly-contributions.service';
import { AnnualContributionsService } from '../annual-contributions/annual-contributions.service';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(CampaignDistribution)
    private readonly campaignDistributionRepo: Repository<CampaignDistribution>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(MonthlyContribution)
    private readonly monthlyContributionRepo: Repository<MonthlyContribution>,
    private readonly paymentsService: PaymentsService,
    private readonly monthlyContributionsService: MonthlyContributionsService,
    private readonly annualContributionsService: AnnualContributionsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateCampaignDto): Promise<Campaign> {
    // Verify payment exists and is undistributed
    const payment = await this.paymentsService.findOne(createDto.paymentId);
    const remainingAmount = this.paymentsService.getRemainingAmount(payment);

    if (remainingAmount <= 0) {
      throw new BadRequestException('Payment has no remaining amount to distribute');
    }

    // Calculate total distribution amount
    const totalDistributionAmount = createDto.distributions.reduce(
      (sum, dist) => sum + Number(dist.amount),
      0,
    );

    if (totalDistributionAmount > remainingAmount) {
      throw new BadRequestException(
        `Total distribution amount (${totalDistributionAmount}) exceeds remaining payment amount (${remainingAmount})`,
      );
    }

    // Use transaction to ensure data consistency
    return await this.dataSource.transaction(async (manager) => {
      // Create campaign
      const campaign = manager.create(Campaign, {
        name: createDto.name,
        description: createDto.description,
        paymentId: createDto.paymentId,
        familyId: createDto.familyId,
        totalDistributed: totalDistributionAmount,
        status: CampaignStatus.COMPLETED,
        distributionDate: new Date(),
      });

      const savedCampaign = await manager.save(Campaign, campaign);

      // Create distributions and update monthly contributions
      for (const distItem of createDto.distributions) {
        // Verify monthly contribution exists
        const monthlyContribution =
          await this.monthlyContributionsService.findOne(
            distItem.monthlyContributionId,
          );

        // Create distribution record
        const distribution = manager.create(CampaignDistribution, {
          campaignId: savedCampaign.id,
          monthlyContributionId: distItem.monthlyContributionId,
          amount: distItem.amount,
        });

        await manager.save(CampaignDistribution, distribution);

        // Update monthly contribution paid amount
        await this.monthlyContributionsService.updatePaidAmount(
          distItem.monthlyContributionId,
          distItem.amount,
        );

        // Update monthly contribution status
        await this.monthlyContributionsService.updateStatus(
          distItem.monthlyContributionId,
        );
      }

      // Update payment distributed amount
      const newDistributedAmount =
        Number(payment.distributedAmount) + totalDistributionAmount;
      await this.paymentsService.updateDistributedAmount(
        createDto.paymentId,
        newDistributedAmount,
      );

      // Update annual contribution total paid
      const monthlyContributions = await Promise.all(
        createDto.distributions.map((dist) =>
          this.monthlyContributionsService.findOne(dist.monthlyContributionId),
        ),
      );

      const annualContributionIds = [
        ...new Set(
          monthlyContributions.map((mc) => mc.annualContributionId),
        ),
      ];

      for (const annualId of annualContributionIds) {
        await this.annualContributionsService.updateTotalPaid(annualId);
      }

      return this.findOne(savedCampaign.id);
    });
  }

  async autoDistributePayment(paymentId: number): Promise<Campaign> {
    const payment = await this.paymentsService.findOne(paymentId);
    const remainingAmount = this.paymentsService.getRemainingAmount(payment);

    if (remainingAmount <= 0) {
      throw new BadRequestException('Payment has no remaining amount to distribute');
    }

    // Get unpaid monthly contributions for this family, ordered by due date (oldest first)
    const unpaidMonths = await this.monthlyContributionRepo
      .createQueryBuilder('monthly')
      .leftJoinAndSelect('monthly.annualContribution', 'annual')
      .where('annual.familyId = :familyId', { familyId: payment.familyId })
      .andWhere('monthly.paidAmount < monthly.expectedAmount')
      .orderBy('monthly.dueDate', 'ASC')
      .getMany();

    if (unpaidMonths.length === 0) {
      throw new BadRequestException('No unpaid monthly contributions found');
    }

    // Distribute payment to oldest unpaid months
    const distributions: { monthlyContributionId: number; amount: number }[] =
      [];
    let remainingToDistribute = remainingAmount;

    for (const monthly of unpaidMonths) {
      if (remainingToDistribute <= 0) break;

      const expectedAmount = Number(monthly.expectedAmount);
      const paidAmount = Number(monthly.paidAmount);
      const needed = expectedAmount - paidAmount;

      if (needed > 0) {
        const distributeAmount = Math.min(needed, remainingToDistribute);
        distributions.push({
          monthlyContributionId: monthly.id,
          amount: distributeAmount,
        });
        remainingToDistribute -= distributeAmount;
      }
    }

    if (distributions.length === 0) {
      throw new BadRequestException('Could not distribute payment');
    }

    // Create campaign with auto-distribution
    const createDto: CreateCampaignDto = {
      name: `Auto Distribution - Payment ${paymentId}`,
      description: 'Automatic distribution to oldest unpaid months',
      paymentId: paymentId,
      familyId: payment.familyId,
      distributions: distributions,
    };

    return this.create(createDto);
  }

  async findAll(familyId?: number, paymentId?: number): Promise<Campaign[]> {
    const queryBuilder = this.campaignRepo
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.payment', 'payment')
      .leftJoinAndSelect('campaign.family', 'family')
      .leftJoinAndSelect('campaign.distributions', 'distributions')
      .leftJoinAndSelect('distributions.monthlyContribution', 'monthly');

    if (familyId) {
      queryBuilder.where('campaign.familyId = :familyId', { familyId });
    }

    if (paymentId) {
      queryBuilder.andWhere('campaign.paymentId = :paymentId', { paymentId });
    }

    return queryBuilder
      .orderBy('campaign.distributionDate', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepo.findOne({
      where: { id },
      relations: [
        'payment',
        'family',
        'distributions',
        'distributions.monthlyContribution',
        'distributions.monthlyContribution.annualContribution',
      ],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async undoDistribution(campaignId: number): Promise<void> {
    const campaign = await this.findOne(campaignId);

    if (campaign.status === CampaignStatus.COMPLETED) {
      throw new BadRequestException('Cannot undo a completed campaign');
    }

    // Use transaction to ensure data consistency
    await this.dataSource.transaction(async (manager) => {
      // Reverse all distributions
      for (const distribution of campaign.distributions) {
        const monthlyContribution =
          await this.monthlyContributionsService.findOne(
            distribution.monthlyContributionId,
          );

        // Subtract the distributed amount
        const newPaidAmount =
          Number(monthlyContribution.paidAmount) - Number(distribution.amount);
        monthlyContribution.paidAmount = Math.max(0, newPaidAmount);

        // Update status
        await this.monthlyContributionsService.updateStatus(
          distribution.monthlyContributionId,
        );

        // Update annual contribution
        await this.annualContributionsService.updateTotalPaid(
          monthlyContribution.annualContributionId,
        );
      }

      // Reverse payment distribution
      const payment = await this.paymentsService.findOne(campaign.paymentId);
      const newDistributedAmount =
        Number(payment.distributedAmount) - Number(campaign.totalDistributed);
      await this.paymentsService.updateDistributedAmount(
        campaign.paymentId,
        Math.max(0, newDistributedAmount),
      );

      // Delete distribution records
      await manager.delete(CampaignDistribution, { campaignId });

      // Delete campaign
      await manager.delete(Campaign, { id: campaignId });
    });
  }
}

