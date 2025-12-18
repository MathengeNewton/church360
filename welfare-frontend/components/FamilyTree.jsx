"use client";

export default function FamilyTree({ family, compact = false }) {
  if (!family || !family.members || family.members.length === 0) {
    return (
      <div className="text-center py-2 text-gray-500 text-sm">
        No members
      </div>
    );
  }

  const primaryMember = family.members.find(
    (m) => m.role === "PRIMARY_MEMBER"
  );
  const spouse = family.members.find((m) => m.role === "SPOUSE");
  const offsprings = family.members.filter((m) => m.role === "OFFSPRING");

  if (compact) {
    // Compact horizontal view
    return (
      <div className="flex items-center gap-2 flex-wrap text-sm">
        {primaryMember && (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded">
            <span className="text-blue-700 font-medium">
              {primaryMember.user.username}
            </span>
            <span className="text-blue-500 text-xs">(Primary)</span>
          </div>
        )}
        {spouse && (
          <div className="flex items-center gap-1 px-2 py-1 bg-pink-50 border border-pink-200 rounded">
            <span className="text-pink-700 font-medium">
              {spouse.user.username}
            </span>
            <span className="text-pink-500 text-xs">(Spouse)</span>
          </div>
        )}
        {offsprings.length > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded">
            <span className="text-green-700 font-medium">
              {offsprings.length} {offsprings.length === 1 ? "child" : "children"}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Full tree view (smaller than before)
  return (
    <div className="flex flex-col items-center py-3">
      {/* Primary Member */}
      {primaryMember && (
        <div className="mb-2">
          <div className="bg-blue-50 border border-blue-300 rounded-md px-3 py-2 text-center min-w-[160px]">
            <p className="text-xs font-semibold text-blue-700 mb-1">Primary</p>
            <p className="font-semibold text-gray-900 text-sm">
              {primaryMember.user.username}
            </p>
            {primaryMember.relationship && (
              <p className="text-xs text-gray-500 mt-0.5">
                ({primaryMember.relationship})
              </p>
            )}
          </div>
        </div>
      )}

      {/* Connection Line */}
      {(spouse || offsprings.length > 0) && (
        <div className="h-4 w-0.5 bg-gray-300 mb-1"></div>
      )}

      {/* Spouse and Offsprings */}
      {(spouse || offsprings.length > 0) && (
        <div className="flex flex-col items-center gap-2">
          {/* Spouse */}
          {spouse && (
            <div className="bg-pink-50 border border-pink-300 rounded-md px-3 py-2 text-center min-w-[160px]">
              <p className="text-xs font-semibold text-pink-700 mb-1">Spouse</p>
              <p className="font-semibold text-gray-900 text-sm">
                {spouse.user.username}
              </p>
              {spouse.relationship && (
                <p className="text-xs text-gray-500 mt-0.5">
                  ({spouse.relationship})
                </p>
              )}
            </div>
          )}

          {/* Connection Line to Offsprings */}
          {offsprings.length > 0 && (
            <div className="h-4 w-0.5 bg-gray-300"></div>
          )}

          {/* Offsprings */}
          {offsprings.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {offsprings.map((offspring) => (
                <div
                  key={offspring.id}
                  className="bg-green-50 border border-green-300 rounded-md px-2 py-1.5 text-center min-w-[120px]"
                >
                  <p className="text-xs font-semibold text-green-700 mb-0.5">
                    Child
                  </p>
                  <p className="font-medium text-gray-900 text-xs">
                    {offspring.user.username}
                  </p>
                  {offspring.relationship && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      ({offspring.relationship})
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
