import React from 'react';
import {Head, usePage} from '@inertiajs/react';

/**
 * MainLayout component that wraps page content with navigation and sets the page title dynamically
 * based on the last segment of the current URL.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside the layout.
 *
 * @returns {JSX.Element} The layout with navigation and dynamic page title.
 */
export default function MainLayout({children}){
    return(
        <div className='main-container'>
            <nav className='nav-container'>
                <div className='nav-item-container'>
                    <div className='nav-left'>
                        <h1><a href='/production-order/home'>Production Order</a></h1>
                        <p>Alpha</p>
                    </div>
                    <div className='nav-right'>
                        <a href="/production-order/home">Home</a>
                        <a href="/production-order/encode">Encode</a>
                        <a href="/production-order/view">View</a>
                        <a href="/production-order/admin">Admin</a>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
