import { useState, useEffect, useMemo } from 'react';
import ResourcesData from '../data/resourceData/resourceData';
import { placeholderWords } from '../data/resourceData/searchBarData';
import booksIcon from "../assets/svg/books.svg";
import ResourceCard from '../components/ResourceCard';

function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const priorityIds = [22, 2, 34];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && !event.target.closest('.filter-dropdown-container')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  // Filter options (excluding Popular)
  const filterOptions = [
    {
      id: 'isBestSeller',
      label: 'Best Seller',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      hoverBg: 'hover:bg-orange-100'
    },
    {
      id: 'isPlacementFocused',
      label: 'Placement Focused',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      hoverBg: 'hover:bg-blue-100'
    },
    {
      id: 'isAdvancedLevel',
      label: 'Advanced',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      hoverBg: 'hover:bg-red-100'
    }
  ];

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const organizedResources = useMemo(() => {
    const priority = [];
    const others = [];

    ResourcesData.forEach(resource => {
      if (priorityIds.includes(resource.id)) {
        priority.push(resource);
      } else {
        others.push(resource);
      }
    });

    priority.sort((a, b) =>
      priorityIds.indexOf(a.id) - priorityIds.indexOf(b.id)
    );

    const shuffledOthers = shuffleArray(others);
    return [...priority, ...shuffledOthers];
  }, []);

  useEffect(() => {
    const currentWord = placeholderWords[wordIndex];
    const typingSpeed = isDeleting ? 10 : 100;
    const pauseTime = 300;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (placeholder.length < currentWord.length) {
          setPlaceholder(currentWord.slice(0, placeholder.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (placeholder.length > 0) {
          setPlaceholder(placeholder.slice(0, -1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % placeholderWords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, wordIndex]);

  const filteredResources = organizedResources.filter(resource => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query);

    if (selectedFilters.length === 0) return matchesSearch;

    // OR logic: resource must have AT LEAST ONE of the selected filters
    const matchesFilters = selectedFilters.some(filterId => resource[filterId] === true);
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      {/* Header with Verified Badge */}
      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        <h3 className="text-3xl font-semibold text-amber-600 flex items-center gap-2">
          <img src={booksIcon} className="inline w-7 h-7" alt="Books" />
          Resources (Interview Tips and Complete Guide)
        </h3>
        <a
          href="https://topmate.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified by Topmate.io
        </a>
      </div>

      {/* Search Box + Filter */}
      <div className="mb-6 flex flex-col items-center">
        <div className="flex items-center gap-3 w-full max-w-3xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Dropdown */}
          <div className="relative filter-dropdown-container">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-lg font-medium transition-all ${
                selectedFilters.length > 0
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                  : 'bg-white text-gray-700 border-amber-300 hover:bg-amber-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filter</span>
              {selectedFilters.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 bg-white text-amber-600 rounded-full text-xs font-bold">
                  {selectedFilters.length}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Filter Resources</span>
                  {selectedFilters.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                  {filterOptions.map(filter => {
                    const isSelected = selectedFilters.includes(filter.id);
                    return (
                      <button
                        key={filter.id}
                        onClick={() => toggleFilter(filter.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isSelected
                            ? `${filter.bgColor} ${filter.textColor} border ${filter.borderColor} shadow-sm`
                            : `text-gray-700 ${filter.hoverBg} border border-transparent`
                        }`}
                      >
                        <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all ${
                          isSelected
                            ? `${filter.borderColor} ${filter.bgColor}`
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && (
                            <svg className={`w-3 h-3 ${filter.textColor}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 flex-1">
                          {filter.icon}
                          <span className="font-medium text-sm">{filter.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters & Count */}
        <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
          {selectedFilters.map(filterId => {
            const filter = filterOptions.find(f => f.id === filterId);
            return (
              <span
                key={filterId}
                className={`flex items-center gap-1.5 ${filter.bgColor} ${filter.textColor} text-xs font-semibold px-3 py-1.5 rounded-full border ${filter.borderColor} shadow-sm`}
              >
                {filter.icon}
                {filter.label}
                <button
                  onClick={() => toggleFilter(filterId)}
                  className="ml-1 hover:bg-white/50 rounded-full p-0.5 transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            );
          })}
          
          {(searchQuery || selectedFilters.length > 0) && (
            <p className="text-sm text-gray-600">
              Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Mobile List + Desktop Grid */}
      {filteredResources.length > 0 ? (
        <>
          <div className="space-y-4 lg:hidden">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} isMobile={true} />
            ))}
          </div>
          <div className="hidden lg:grid lg:grid-cols-5 gap-6 ml-8 mr-8">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} isMobile={false} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-amber-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium mb-2">No resources found</p>
          <p className="text-sm">
            {selectedFilters.length > 0 ? (
              <>Try removing some filters or search for something else</>
            ) : (
              <>No resources match "{searchQuery}"</>
            )}
          </p>
        </div>
      )}

      {/* Help CTA Section */}
      <div className="mt-12 mb-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200 shadow-lg">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Need Help or Missing Resources?
          </h3>

          <p className="text-gray-600 text-center mb-6 text-lg max-w-2xl mx-auto">
            We're here to support you. If you've purchased a resource and can't find it, or if you're looking for something specific, our team is ready to assist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact-us"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-300 hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Browse All Resources
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-orange-200">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Quick Response</span>
              </div>
              <span className="hidden sm:inline text-orange-300">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="font-medium">24/7 Support</span>
              </div>
              <span className="hidden sm:inline text-orange-300">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">100% Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Resources;