import React from 'react'

const StatCard = ({ label, value, icon, trend, trendText }) => {
  const trendUp = trend === 'up'
  const trendDown = trend === 'down'

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {(trendUp || trendDown) && (
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  trendUp ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <span>{trendUp ? '↑' : '↓'}</span>
                <span>{trendText}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-4xl ml-4">{icon}</div>
      </div>
    </div>
  )
}

export default StatCard
