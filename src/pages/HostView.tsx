import React from "react"
import { Link } from "react-router-dom"

export default function Host() {
  return (
    <>
      <nav id="header" className="bg-white fixed w-full z-10 top-0 shadow">
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between my-4">
          <div className="pl-4 md:pl-0">
            <Link
              className="flex items-center text-yellow-600 text-base xl:text-xl no-underline hover:no-underline font-extrabold font-sans"
              to="/"
            >
              <svg
                className="fill-current h-6 inline-block text-yellow-600 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16 2h4v15a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V0h16v2zm0 2v13a1 1 0 0 0 1 1 1 1 0 0 0 1-1V4h-2zM2 2v15a1 1 0 0 0 1 1h11.17a2.98 2.98 0 0 1-.17-1V2H2zm2 8h8v2H4v-2zm0 4h8v2H4v-2zM4 4h8v4H4V4z" />
              </svg>
              Code Kahoot / Host
            </Link>
          </div>
        </div>
      </nav>
      <div className="container w-full flex flex-wrap mx-auto px-2 pt-8 lg:pt-16 mt-16">
        <div className="w-full lg:w-1/5 px-6 text-xl text-gray-800 leading-normal">
          <p className="text-base font-bold py-2 lg:pb-6 text-gray-700">Menu</p>
          <div className="block lg:hidden inset-0">
            <button
              id="menu-toggle"
              className="flex w-full justify-end px-3 py-3 bg-white lg:bg-transparent border rounded border-gray-600 hover:border-yellow-600 appearance-none focus:outline-none"
            >
              <svg
                className="fill-current h-3 float-right"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>
          </div>
          <div
            className="w-full inset-0 hidden max-h-64 lg:h-auto overflow-x-hidden overflow-y-auto lg:overflow-y-hidden lg:block mt-0 my-2 lg:my-0 border border-gray-400 lg:border-transparent bg-white shadow lg:shadow-none lg:bg-transparent z-20"
            id="menu-content"
          >
            <ul className="list-reset py-2 md:py-0">
              <li className="py-1 md:my-2 hover:bg-yellow-100 lg:hover:bg-transparent border-l-4 border-transparent font-bold border-yellow-600">
                <a
                  href="#section1"
                  className="block pl-4 align-middle text-gray-700 no-underline hover:text-yellow-600"
                >
                  <span className="pb-1 md:pb-0 text-sm">Question 1</span>
                </a>
              </li>
              <li className="py-1 md:my-2 hover:bg-yellow-100 lg:hover:bg-transparent border-l-4 border-transparent">
                <a
                  href="#section2"
                  className="block pl-4 align-middle text-gray-700 no-underline hover:text-yellow-600"
                >
                  <span className="pb-1 md:pb-0 text-sm">Question 2</span>
                </a>
              </li>
              <li className="py-1 md:my-2 hover:bg-yellow-100 lg:hover:bg-transparent border-l-4 border-transparent">
                <a
                  href="#section3"
                  className="block pl-4 align-middle text-gray-700 no-underline hover:text-yellow-600"
                >
                  <span className="pb-1 md:pb-0 text-sm">Question 3</span>
                </a>
              </li>
              <li className="py-1 md:my-2 hover:bg-yellow-100 lg:hover:bg-transparent border-l-4 border-transparent">
                <a
                  href="#section4"
                  className="block pl-4 align-middle text-gray-700 no-underline hover:text-yellow-600"
                >
                  <span className="pb-1 md:pb-0 text-sm">Question 4</span>
                </a>
              </li>

              <li className="py-1 md:my-2 hover:bg-yellow-100 lg:hover:bg-transparent border-l-4 border-transparent">
                <a
                  href="#section5"
                  className="block pl-4 align-middle text-gray-700 no-underline hover:text-yellow-600"
                >
                  <span className="pb-1 md:pb-0 text-sm">Question 5</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <section className="w-full lg:w-4/5">
          <h1 className="flex items-center font-sans font-bold break-normal text-gray-700 text-xl mt-12 lg:mt-0 md:text-2xl">
            Insert Gamename Here
          </h1>
          <h2>(#gameId)</h2>

          <hr className="bg-gray-300 my-12" />

          <h2
            id="section1"
            className="font-sans font-bold break-normal text-gray-700 px-2 pb-8 text-xl"
          >
            Question 1
          </h2>

          <div className="p-8 mt-6 lg:mt-0 leading-normal rounded shadow bg-white">
            <h3>Find the shortest sequence starting with 111</h3>
            <p></p>
          </div>

          <hr className="bg-gray-300 my-12" />

          <h2 className="font-sans font-bold break-normal text-gray-700 px-2 pb-8 text-xl">
            Question 2
          </h2>

          <div
            id="section5"
            className="p-8 mt-6 lg:mt-0 rounded shadow bg-white"
          >
            <blockquote className="border-l-4 border-yellow-600 italic my-4 pl-8 md:pl-12">
              Final confirmation disclaimer message etc
            </blockquote>

            <div className="pt-8">
              <button
                className="shadow bg-yellow-700 hover:bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mr-4"
                type="button"
              >
                Save
              </button>

              <button
                className="shadow bg-yellow-100 hover:bg-yellow-200 focus:shadow-outline focus:outline-none text-gray-700 font-bold py-2 px-4 rounded mr-4"
                type="button"
              >
                Additional Action
              </button>

              <button
                className="shadow bg-yellow-100 hover:bg-yellow-200 focus:shadow-outline focus:outline-none text-gray-700 font-bold py-2 px-4 rounded"
                type="button"
              >
                Additional Action
              </button>
            </div>
          </div>
        </section>

        <div className="w-full lg:w-4/5 lg:ml-auto text-base md:text-sm text-gray-600 px-4 py-24 mb-12">
          <span className="text-base text-yellow-600 font-bold">&lt;</span>{" "}
          <a
            href="#"
            className="text-base md:text-sm text-yellow-600 font-bold no-underline hover:underline"
          >
            Back link
          </a>
        </div>
      </div>
    </>
  )
}
