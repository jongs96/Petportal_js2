import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUI } from '../contexts/UIContext';

const useFetchAndFilterData = (apiUrl, dataExtractor, options = {}) => {
  const {
    enablePagination = false,
    enableSearch = false,
    itemsPerPage = 5
  } = options;

  const { setIsLoading } = useUI();
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const extractor = useCallback(dataExtractor || (data => data), []);

  const fetchData = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    if (setIsLoading) setIsLoading(true);

    try {
      let url = apiUrl;
      const params = new URLSearchParams();

      if (enablePagination) {
        params.append('page', page.toString());
        params.append('limit', itemsPerPage.toString());
      }

      if (enableSearch && search) {
        params.append('search', search);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);

      if (enablePagination && response.data.pagination) {
        const extractedData = extractor(response.data.data || response.data.items || []);
        setAllData(extractedData);
        setFilteredData(extractedData);
        setTotalItems(response.data.pagination.total || response.data.total || 0);
      } else {
        const extractedData = extractor(response.data);
        setAllData(extractedData);
        setFilteredData(extractedData);
        setTotalItems(extractedData.length);
      }
    } catch (err) {
      console.error(`Failed to fetch data from ${apiUrl}:`, err);
      setError(err);
      setAllData([]);
      setFilteredData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
      if (setIsLoading) setIsLoading(false);
    }
  }, [apiUrl, setIsLoading, extractor, enablePagination, enableSearch, itemsPerPage]);

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [fetchData, currentPage, searchTerm]);

  // Function to apply new filters (for client-side filtering)
  const applyFilter = useCallback((filterFn) => {
    if (enablePagination) {
      // For paginated data, we don't do client-side filtering
      return;
    }
    setFilteredData(filterFn(allData));
  }, [allData, enablePagination]);

  // Pagination controls
  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(totalItems / itemsPerPage);
    setCurrentPage(prev => Math.min(prev + 1, maxPage));
  }, [totalItems, itemsPerPage]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  // Search functionality
  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    allData,
    filteredData,
    applyFilter,
    error,
    loading,
    fetchData,
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    // Search
    searchTerm,
    updateSearchTerm
  };
};

export default useFetchAndFilterData;