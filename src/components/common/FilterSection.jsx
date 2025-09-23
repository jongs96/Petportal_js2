import React, { useState, useEffect } from 'react';
import styles from './FilterSection.module.css';
import searchIcon from '../../assets/search.png';

const FilterSection = ({ children, locationPlaceholder, onLocationChange, isMobile }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(!isMobile); // Expanded by default on web
    const [location, setLocation] = useState('');

    useEffect(() => {
        setIsFilterVisible(!isMobile); // Update visibility when isMobile changes
    }, [isMobile]);

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
        if (onLocationChange) {
            onLocationChange(e.target.value);
        }
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.searchAndToggle}>
                <div className={styles.filterInputWrapper}>
                    <img src={searchIcon} alt="돋보기 아이콘" className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={locationPlaceholder}
                        value={location}
                        onChange={handleLocationChange}
                        className={styles.filterInput}
                    />
                </div>
                {isMobile && ( // Conditionally render button for mobile
                    <button
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={styles.toggleButton}
                        aria-expanded={isFilterVisible}
                    >
                        상세 필터 {isFilterVisible ? '▲' : '▼'}
                    </button>
                )}
            </div>
            {isFilterVisible && (
                <div className={styles.advancedFilters}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default FilterSection;