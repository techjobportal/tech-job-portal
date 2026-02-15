import { useState, useEffect, useMemo } from 'react';
import ResourcesData from '../data/resourceData/resourceData';
import { placeholderWords } from '../data/resourceData/searchBarData';
import booksIcon from "../assets/svg/books.svg";

function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Priority resource IDs that should always appear first
  const priorityIds = [22, 2, 34]; // 22,2,34

  // Shuffle array function using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Organize resources: priority first, then shuffled others
  // This runs only once when component mounts
  const organizedResources = useMemo(() => {
    const priority = [];
    const others = [];

    // Separate priority and other resources
    ResourcesData.forEach(resource => {
      if (priorityIds.includes(resource.id)) {
        priority.push(resource);
      } else {
        others.push(resource);
      }
    });

    // Sort priority resources by the order in priorityIds
    priority.sort((a, b) => 
      priorityIds.indexOf(a.id) - priorityIds.indexOf(b.id)
    );

    // Shuffle the other resources
    const shuffledOthers = shuffleArray(others);

    return [...priority, ...shuffledOthers];
  }, []); // Empty dependency array - runs once on mount

  // Typing animation effect
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

  // Filter resources based on search query
  const filteredResources = organizedResources.filter(resource => {
    const query = searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query)
    );
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
          href="https://topmate.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified by topmate.io
        </a>
      </div>

      {/* Trust Banner */}
      {/* <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center gap-3 flex-wrap text-sm text-green-800">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Trusted Platform</span>
          </div>
          <span className="hidden sm:inline text-green-600">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-semibold">106+ Users</span>
          </div>
          <span className="hidden sm:inline text-green-600">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">35+ Quality Resources</span>
          </div>
        </div>
      </div> */}

      {/* Search Box */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 border border-amber-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-500
                       focus:border-transparent text-black"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            Found {filteredResources.length} resource
            {filteredResources.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Mobile List + Desktop Grid */}
      {filteredResources.length > 0 ? (
        <>
          {/* MOBILE LIST */}
          <div className="space-y-4 lg:hidden">
            {filteredResources.map(resource => (
              <div
                key={resource.id}
                className="flex items-center gap-4 p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200"
              >
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-grow">
                  <h4 className="font-semibold text-lg text-gray-800 mb-1">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {resource.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold text-amber-600">
                    {resource.price}
                  </span>

                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-amber-500 hover:bg-amber-600 rounded-full transition-colors"
                    title="View Resource"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP GRID */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-6 ml-8 mr-8">
            {filteredResources.map(resource => (
              <div
                key={resource.id}
                className="flex flex-col bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="w-full aspect-square bg-gray-100">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="font-semibold text-base text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                    {resource.title}
                  </h4>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-amber-200">
                    <span className="text-lg font-bold text-amber-600">
                      {resource.price}
                    </span>

                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-amber-500 hover:bg-amber-600 rounded-full transition-colors"
                      title="View Resource"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-amber-50">
          No resources found matching "{searchQuery}"
        </div>
      )}

      <h3 className="text-center mb-4 mt-4">
        <a href="/contact-us" className="inline-flex items-center gap-2 text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors group">
          In case of missing resources in purchase please contact us. <br />
          Couldn't find what you were looking for? Reach out to us!
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </h3>
    </div>
  );
}

export default Resources;