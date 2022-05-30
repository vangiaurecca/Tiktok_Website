import { useRef, useState, useEffect } from 'react';
import * as searchServices from '~/services/searchServices';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SearchIcon } from '~/components/Icons';
import AccountItem from '~/components/AccountItem';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);
const Search = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef();
    const debounced = useDebounce(searchValue, 500);
    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchAPI = async () => {
            setLoading(true);
            const result = await searchServices.search(debounced);
            setSearchResult(result);
            setLoading(false);
        };
        fetchAPI();
    }, [debounced]);
    const handleClearText = () => {
        setSearchValue('');
        setSearchResult([]);
        searchRef.current.focus();
    };
    const handleHideResult = () => {
        setShowResult(false);
    };
    return (
        <TippyHeadless
            visible={showResult && searchResult.length > 0}
            onClickOutside={handleHideResult}
            interactive
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <h3 className={cx('search-label')}>Tài khoản</h3>
                        {searchResult && searchResult.map((result) => <AccountItem key={result.id} data={result} />)}
                    </PopperWrapper>
                </div>
            )}
        >
            <div className={cx('search')}>
                <input
                    ref={searchRef}
                    value={searchValue}
                    type="text"
                    placeholder="Tìm kiếm tài khoản và video"
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setShowResult(true)}
                    spellCheck={false}
                    onKeyDown={(e) => {
                        if (e.keyCode === 32 && !searchValue) {
                            e.preventDefault();
                        }
                    }}
                />
                <div className={cx('icon-wrapper')}>
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClearText}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                </div>

                <button className={cx('search-btn')}>
                    <SearchIcon />
                </button>
            </div>
        </TippyHeadless>
    );
};

export default Search;
