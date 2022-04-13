import {
    createContext,
    html,
    render,
    useContext,
    useEffect,
    useReducer,
    useState,
} from './htm-preact.js';

const TagSelectModal = () => {};

const TagSelectDropdown = ({
    displaySearch = true,
    isOpen = false,
    options = {},
    selectedOptions = [],
    onClose,
    onSelect,
}) => {

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', onDocumentClick, { once: true });
        }
    }, [isOpen]);

    const Search = ({ placeholder = 'Search...' }) => {
        return html`
            <div class="tagselect-dropdown-search">
                <input type="search" placeholder=${placeholder} />
            </div>
        `;
    };

    const onItemClick = (e) => {
        console.log(e.target.dataset.value);
        if (onSelect) {
            onSelect(e.target.dataset.value);
        }
    };

    const onDocumentClick = (e) => {
        if (isOpen && onClose && e.target.closest('.tagselect') === null) {
            onClose();
        } else {
            document.addEventListener('click', onDocumentClick, { once: true });
        }
    };

    const getItems = () =>
        Object.entries(options).map(([value, label]) => {
            const isDisabled = selectedOptions.indexOf(value) !== -1;
            return html`<li>
                <div class=${`tagselect-dropdown-item ${isDisabled && 'is-disabled'}`} data-value=${value} onClick=${!isDisabled && onItemClick}>
                    ${label}
                </div>
            </li>`;
        });

    return html`
        <div class=${`tagselect-dropdown ${isOpen && 'is-open'}`}>
            ${displaySearch && html`<${Search} />`}
            <div class="tagselect-dropdown-options">
                <ul>
                    ${getItems()}
                </ul>
            </div>
        </div>
    `;
};

const TagSelect = ({ options = {}, modal = false, label = '', selectedOptions = [], onSelectedChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // useEffect(() => {
    //     onSelectedChange
    // }, [selectedOptions])

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const onTagDelete = (ev, val) => {
        ev.preventDefault();
        const optionIndex = selectedOptions.indexOf(val);
        if (optionIndex === -1) return;
        selectedOptions.splice(optionIndex,1)
        onSelectedChange([...selectedOptions])
    }

    const selectedItems = [...selectedOptions].map(option => html`
        <div class="tagselect-tag">
            <span class="tagselect-tag-text">${options[option]}</span>
            <span class="tagselect-tag-delete" onClick=${e => onTagDelete(e, option)}>X</span>
        </div>
    `);

    const onDropdownSelect = (val) => {
        if (selectedOptions.indexOf(val) === -1) {
            selectedOptions.push(val);
        }
        onSelectedChange([...selectedOptions]);
    }

    const onDropdownClose = () => {
        setIsDropdownOpen(false);
    }

    return html`
        <div class="tagselect">
            <div class="tagselect-input" onClick=${toggleDropdown}>
                <div class="tagselect-values">${selectedItems}</div>
                <div class="tagselect-add">
                    <span
                        class=${`tagselect-plus ${isDropdownOpen && 'is-open'}`}
                    ></span>
                </div>
            </div>
            <${TagSelectDropdown}
                isOpen=${isDropdownOpen}
                options=${options}
                selectedOptions=${selectedOptions}
                onClose=${onDropdownClose}
                onSelect=${onDropdownSelect}
            />
        </div>
    `;
};

export default TagSelect;
