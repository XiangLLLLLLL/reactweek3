function Pagination({ getData, pageInfo }) {
  const handlePageSwitch = (page) => {
    getData(page);
  };
  return (
    <ul className="pagination d-flex justify-content-center">
      <li className={`page-item ${!pageInfo.has_pre && `disabled`}`}>
        <a onClick={() => handlePageSwitch(pageInfo.current_page - 1)} className="page-link" href="#">
          上一頁
        </a>
      </li>
      {Array.from({ length: pageInfo.total_pages }).map((_, index) => {
        return (
          <li className={`page-item ${pageInfo.current_page === index + 1 && `active`}`} key={index}>
            <a onClick={() => handlePageSwitch(index + 1)} className="page-link" href="#">
              {index + 1}
            </a>
          </li>
        );
      })}
      <li className={`page-item ${!pageInfo.has_next && `disabled`}`}>
        <a onClick={() => handlePageSwitch(pageInfo.current_page + 1)} className="page-link" href="#">
          下一頁
        </a>
      </li>
    </ul>
  );
}

export default Pagination;
