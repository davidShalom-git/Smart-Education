'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/store/Auth'

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Subjects', href: '/Subjects-File' },
    { name: 'AI-Agents', href: '/Agents' },
    { name: 'Dashboard', href: '/Dashboard' },
    { name: 'Leaderboard', href: '/Leaderboard' },
    ...(user?.role === 'admin' ? [{ name: 'Teacher', href: '/Teacher' }] : []),
    { name: 'About', href: '/About' },
  ]

  return (
    <>
      <header className='sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border border-gray-200 mt-4 sm:mt-6 md:mt-10 rounded-full w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto px-4 sm:px-6 md:px-12 lg:px-20'>
        <div className='mx-auto'>
          <div className='flex justify-between items-center h-14 sm:h-16'>
            {/* Logo */}
            <div className='flex-shrink-0'>
              <Link
                href='/'
                className='text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200'
              >
                Champion
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className='hidden md:block'>
              <ul className='flex space-x-8'>
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className='text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group'
                    >
                      {item.name}
                      <span className='absolute left-0 bottom-[-4px] w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full'></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA Button - Desktop */}
            <div className='hidden md:block'>
              <Link
                href='/contact'
                className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <button
                onClick={toggleMenu}
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
                aria-expanded={isMenuOpen}
              >
                <span className='sr-only'>Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu - Separate floating element */}
      <div className={`md:hidden fixed top-20 sm:top-24 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[90%] z-40 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className='bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 rounded-2xl p-4'>
          <div className='space-y-2'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200'
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile CTA Button */}
            <div className='pt-2'>
              <Link
                href='/contact'
                className='bg-blue-600 text-white hover:bg-blue-700 block px-4 py-3 rounded-xl text-base font-medium text-center transition-colors duration-200 w-full'
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isMenuOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30'
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Nav