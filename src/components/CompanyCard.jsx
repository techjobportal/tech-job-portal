import React from 'react'
import { Building2, MapPin, Briefcase, IndianRupee } from 'lucide-react'
import { Link } from 'react-router-dom'

const CompanyCard = ({ company }) => {
  return (
    <Link
      to={`/company-details/${company.company}/${company.role}`}
      className="group bg-[#FFFDFB] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-black/10 hover:border-[#FA5500]"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[#FA5500] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-bold text-black group-hover:text-[#FA5500] transition-colors leading-tight">
            {company.role}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-black/60">
            <Building2 className="w-4 h-4 flex-shrink-0 text-black/40" />
            <span className="truncate">{company.company}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-black/60">
            <MapPin className="w-4 h-4 flex-shrink-0 text-black/40" />
            <span className="truncate">{company.location}</span>
          </div>

          {/* <div className="flex items-center gap-2 text-sm font-semibold text-[#FA5500]">
            <IndianRupee className="w-4 h-4 flex-shrink-0" />
            <span>{company.Stipend}</span>
          </div> */}
        </div>

        <div className="mt-6 pt-4 border-t border-black/10">
          <span className="inline-flex items-center gap-1 text-[#FA5500] font-medium text-sm group-hover:gap-2 transition-all">
            View Details
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CompanyCard
