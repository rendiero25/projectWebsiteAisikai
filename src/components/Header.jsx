import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiSearch } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";

import Nav from './Nav';
import MobileMenu from './MobileMenu';
import Footer from './Footer';

import logoAisikai from '../assets/images/logo-aisikai.jpg';
import iconIndonesia from '../assets/icons/indonesia.svg';
import iconUk from '../assets/icons/uk.svg';

const Header = () => {
    const navigate = useNavigate();

    const navLink = [
        {label: "Home", href: "/"},
        {label: "Products", href: "/products"},
        {label: "About Us", href: "/about-us"},
        {label: "Download", href: "/download"},
        {label: "Contact Us", href: "/contact-us"},
    ];

    const products = [
        "ASP Anti-Surge Module",
        "SKT1 Series Class PC ATS",
        "SKT2 Series Ultra-thin Class PC ATS",
        "ASKQ1 Series Household ATS 16A-63A",
        "ASKM2E-Y Series Intelligent Electronic Molded Case Circuit Breaker",
        "ASKW2 Series Fixed Type Intelligent Universal Circuit Breaker",
        // ...add more product names here...
    ];

    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [language, setLanguage] = useState("en"); // Default language is English

    const handleShowMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (query) {
            const results = products.filter(product =>
                product.toLowerCase().includes(query)
            );
            setFilteredProducts(results);
        } else {
            setFilteredProducts([]);
        }
    };

    const handleProductClick = (productName) => {
        navigate('/products', { state: { search: productName } });
        setSearchQuery("");
        setFilteredProducts([]);
    };

    const handleLanguageChange = (lang) => {
        if (lang === "id") {
            // Load script Google Translate
            const script = document.createElement('script');
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
    
            // Global init function (HARUS GLOBAL)
            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'id',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false
                    },
                    'google_translate_element'
                );
    
                // Polling untuk klik Bahasa Indonesia
                const interval = setInterval(() => {
                    const iframe = document.querySelector('iframe.goog-te-menu-frame');
                    if (iframe) {
                        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const langOption = innerDoc.querySelector('a[lang="id"]');
                        if (langOption) {
                            langOption.click();
                            clearInterval(interval);
                        }
                    }
                }, 500);
            };
        } else {
            // Reset ke Inggris dengan reload
            window.location.reload();
        }
    };

    useEffect(() => {
        if (language === "id") {
            handleLanguageChange("id");
        }
    }, [language]);

    return (
        <section className="bg-linear-to-r from-white via-blue-50 to-white relative flex flex-row gap-4 py-6 xl:py-[0.05rem] px-6 xl:px-16 justify-between items-center">
            <div className="flex items-center">
                <a href="/">
                    <img src={logoAisikai} alt="logo-aisikai" className='w-[10rem] 2xl:w-[12rem]'/>
                </a> 
            </div>

            <div className="hidden xl:flex">
                <Nav linkToNav={navLink}/>
            </div>

            <div className='flex flex-row items-center justify-end gap-8'>
                <div className='hidden xl:flex flex-col relative'>
                    <div className='flex flex-row items-center px-4 bg-gray-100 rounded-full'>
                        <FiSearch className="bg-gray-100 size-4"/>
                        <input
                            type="search"
                            name="search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="px-4 py-2 rounded-full outline-none flex-1 w-40"
                        />
                    </div>
                    {filteredProducts.length > 0 && (
                        <ul className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg w-full z-10">
                            {filteredProducts.map((product, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleProductClick(product)}
                                >
                                    {product}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className='hidden xl:flex flex-row gap-4 justify-center items-center'>
                    <button className="w-8 cursor-pointer" onClick={() => handleLanguageChange("id")}>
                        <img src={iconIndonesia} alt="button-bahasaindonesia" className="w-full h-full object-cover"/>
                    </button>
                    <button className="w-8 cursor-pointer" onClick={() => handleLanguageChange("en")}>
                        <img src={iconUk} alt="button-english" className="w-full h-full object-cover"/>
                    </button>
                </div>
            </div>
            
            <button className='xl:hidden'>
                <FiMenu className="size-[2.5rem]" onClick={handleShowMenu}/>
            </button>

            {showMenu && 
                (
                    <div className="absolute top-0 w-full z-20 shadow-2xl">
                        <div className="">
                            <MobileMenu logo={logoAisikai} linkToNav={navLink} handleShowMenu={handleShowMenu} />
                        </div>
                    </div> 
                )
            }

            <div id='google_translate_element' className='hidden'></div>
        </section>
    );

    
};

export default Header;