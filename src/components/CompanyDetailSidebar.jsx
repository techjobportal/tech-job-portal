import React from 'react'
import { Link } from 'react-router-dom'
import PromoData from '../data/resourceData/promoData'

const CompanyDetailSidebar = () => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Resources to Crack Interviews
        </h3>

        <div className="space-y-3">
          {PromoData.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg
                         hover:bg-orange-50 transition-colors
                         border border-gray-200 hover:border-orange-300"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 object-contain"
              />

              {/* Title */}
              <span className="text-sm font-medium text-gray-800 flex-1">
                {item.title}
              </span>

              {/* Arrow */}
              <span className="text-orange-500 font-bold text-lg">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailSidebar
