import { Link, useLocation } from "react-router-dom";
export function Pagination({ totalPages, currentPage, onPageChange }) {
  const location = useLocation();
  const toPersianNumber = (number) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return number.toString().replace(/\d/g, (d) => persianDigits[d]);
  };
  
  const getPageNumbers = () => {
    const pages = [];
    
    pages.push(1);
    
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    if (start > 2) {
      pages.push("...");
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages - 1) {
      pages.push("...");
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const getPageUrl = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    return `${location.pathname}?${searchParams.toString()}`;
  };
  
  const handlePageClick = (page, e) => {
    if (page === "...") {
      e.preventDefault();
      return;
    }
    
    onPageChange(page);
  };
  
  return (
    <div className="pagination">
      <ul className="list-inline">
        {/* Previous button */}
        {currentPage > 1 && (
          <li className="list-inline-item">
            <Link 
              to={getPageUrl(currentPage - 1)} 
              onClick={(e) => handlePageClick(currentPage - 1, e)}
              aria-label="صفحه قبلی"
            >
              →
            </Link>
          </li>
        )}
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <li key={index} className="list-inline-item">
            {page === "..." ? (
              <span className="ellipsis">...</span>
            ) : (
              <Link
                to={getPageUrl(page)}
                className={currentPage === page ? "active" : ""}
                onClick={(e) => handlePageClick(page, e)}
              >
                {toPersianNumber(page)}
              </Link>
            )}
          </li>
        ))}
        
        {/* Next button */}
        {currentPage < totalPages && (
          <li className="list-inline-item">
            <Link 
              to={getPageUrl(currentPage + 1)}
              onClick={(e) => handlePageClick(currentPage + 1, e)}
              aria-label="صفحه بعدی"
            >
              ←
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
