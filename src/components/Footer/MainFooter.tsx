import React from 'react'
import Newsletter from './Newsletter'
import Copyright from './Copyright'
import FooterMenu from './FooterMenu'
import PmpLogo from "@/assets/pmp-logo.png";
 
export default function MainFooter() {
    return (
        <footer className='bg-Black_light'>
            <div className='footer-upper py-9 md:py-[50px]'>
                <div className='max-w-[1226px] w-full px-3 md:px-4 m-auto gap-8 md:gap-[50px] grid'>
                    <Newsletter />
                    <FooterMenu/>
                </div>
            </div>
            <Copyright />
            <div className="fixed bottom-3 left-3 z-10 max-w-16 lg:max-w-24"><img src={PmpLogo} alt="PmpLogo" /></div>
        </footer>
    )
}
