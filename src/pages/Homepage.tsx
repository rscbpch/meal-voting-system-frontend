import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";
// import SmallFood1 from "../assets/small-food-1.png";
// import SmallFood2 from "../assets/small-food-2.png";
import Food from "../assets/rounded-food.png";
// import cabbage from "../assets/cabbage.png";
// import onion from "../assets/onion.png";
// import pepper from "../assets/pepper.png";
// import pumpkin from "../assets/pumpkin.png";
// import tomato from "../assets/tomato.png";
import borito from "../assets/borito.png";
import flatSandwich from "../assets/flat-sandwich.png";
import fries from "../assets/fries.png";
import hamburger from "../assets/hamburger.png";
import pizza from "../assets/pizza.png";
import sandwich from "../assets/sandwich.png";
import steak from "../assets/steak.png";
import tacobell from "../assets/tacobell.png";

const Homepage = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#F6FFE8] min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center">
                <section className="py-18 relative bg-[#f5f5f5] flex flex-col items-center justify-center w-full overflow-hidden">
                    <img src={borito}  alt="borito" className="hidden md:block absolute left-[8%] top-[12%] w-[90px] rotate-[-12deg] opacity-80 z-0" />
                    <img src={fries} alt="fries" className="hidden md:block absolute left-[65%] top-[18%] w-[100px] rotate-[18deg] opacity-80 z-0" />
                    <img src={flatSandwich} alt="flat-sandwich"/>
                    <img src={hamburger} alt="hamburger" className="hidden md:block absolute left-[20%] bottom-[10%] w-[54px] rotate-[8deg] opacity-80 z-0" />
                    <img src={pizza} alt="pizza" className="hidden md:block absolute left-[60%] bottom-[14%] w-[66px] rotate-[-8deg] opacity-80 z-0" />
                    <img src={sandwich} alt="sandwich" className="hidden md:block absolute left-[30%] top-[60%] w-[44px] rotate-[24deg] opacity-80 z-0" />
                    <img src={steak} alt="steak" className="hidden md:block absolute left-[90%] top-[10%] w-[44px] rotate-[24deg] opacity-80 z-30" />
                    <img src={tacobell} alt="tacobell" className="hidden md:block absolute left-[95%] top-[65%] w-[44px] rotate-[0deg] opacity-80 z-30" />
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="9" r="9" fill="#3E7E1F"/>
                    </svg>
                    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18.5" cy="18.5" r="18.5" fill="#95D178"/>
                    </svg>


                    <div className="absolute top-[-40px] right-0 z-10 w-[470px] h-[520px]">
                        <img src={Food} alt="Food" className="absolute left-1/2 -translate-x-1/2 top-35 z-20 w-[320px] h-auto" />
                        <svg width="470" height="520" viewBox="0 0 388 681" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="max-w-[470px] h-auto">
                            <path d="M425.647 162.133C426.817 162.421 427.986 162.709 429.153 162.997C432.909 159.215 436.95 155.451 441.298 151.736C451.408 143.099 462.021 135.725 472.794 129.19C483.568 122.654 494.044 116.773 505.865 111.985C529.931 102.238 547.791 95.3494 545.857 92.4903C544.912 91.0938 540.932 90.1721 535.981 89.4738C531.03 88.7756 525.281 88.3148 466.825 92.1202C408.368 95.9256 300.473 103.76 244.931 107.677C189.389 111.594 186.294 111.594 183.835 111.832C181.376 112.069 179.607 112.53 178.039 113.472C176.472 114.415 175.145 115.798 175.393 117.201C175.641 118.605 177.26 120.342 178.977 120.916C185.932 123.241 194.775 126.254 203.104 128.359C210.48 130.223 229.634 132.747 263.939 140.013C279.301 143.267 291.431 144.414 300.051 145.347C306.503 146.046 317.526 145.639 330.891 148.147C339.56 149.774 360.122 151.418 388.59 156.072C407.042 159.089 416.085 159.78 425.647 162.133Z" fill="url(#pattern0_1617_2073)"/>
                            <path d="M76 122.766C76.8844 124.609 80.8775 128.324 93.0914 139.887C102.052 148.37 115.476 163.432 124.748 174.715C139.41 192.557 146.979 212.49 153.23 232.251C157.182 244.744 158.167 258.602 160.847 273.943C164.557 295.177 166.221 316.333 167.996 337.65C169.121 351.154 171.54 370.028 173.564 383.909C176.81 406.179 184.485 425.692 193.409 443.371C200.898 458.207 218.815 470.882 233.173 477.46C242.257 481.621 266.103 480.727 297.539 482.117C322.418 483.217 336.813 487.696 343.5 490.95C357.429 497.728 372.537 509.551 385.207 525.282C408.052 553.649 418.579 577.993 421.245 584.026C424.598 591.61 430.183 597.083 433.968 600.804C440.407 607.134 449.372 605.029 458.53 602.704C465.838 600.848 469.927 593.41 474.181 587.817C478.999 581.483 486.435 571.569 489.155 562.687C490.312 558.911 491.835 554.769 492.284 512.798C492.709 473.133 491.849 396.17 491.842 354.45C491.835 312.73 492.278 308.583 492.727 288.012C493.175 267.442 493.618 230.575 492.961 210.431C492.304 190.286 490.536 187.982 488.74 186.334C485.487 183.349 481.585 181.432 475.588 177.955C465.26 171.966 445.512 167.021 425.647 162.133C416.085 159.78 407.042 159.089 388.59 156.072C360.122 151.418 339.56 149.774 330.891 148.147C317.526 145.639 306.503 146.046 300.051 145.347C291.431 144.414 279.301 143.267 263.939 140.013C229.634 132.747 210.48 130.223 203.104 128.359C194.775 126.254 185.932 123.241 178.977 120.916C177.26 120.342 175.641 118.605 175.393 117.201C175.145 115.798 176.472 114.415 178.039 113.472C179.607 112.53 181.376 112.069 183.835 111.832C186.294 111.594 189.389 111.594 244.931 107.677C300.473 103.76 408.368 95.9256 466.825 92.1202C525.281 88.3148 531.03 88.7756 535.981 89.4738C540.932 90.1721 544.912 91.0938 545.857 92.4903C547.791 95.3494 529.931 102.238 505.865 111.985C494.044 116.773 483.568 122.654 472.794 129.19C462.021 135.725 451.408 143.099 441.298 151.736C421.057 169.029 407.47 187.395 398.332 203.637C388.296 221.473 385.991 240.462 385.093 260.159C384.532 272.47 385.964 289.535 387.083 300.853C388.202 312.172 389.528 317.241 392.644 343.816C395.759 370.391 400.623 418.318 402.908 443.7C405.192 469.081 404.75 470.463 403.638 470.715C402.526 470.966 400.757 470.044 387.686 441.919C374.614 413.794 350.294 358.493 332.901 313.414C315.508 268.336 305.779 235.155 300.547 216.219C292.29 186.338 289.512 174.939 286.39 168.641C284.654 165.138 282.37 162.343 280.139 161.868C273.367 160.426 278.779 176.74 281.66 196.361C284.2 213.661 288.521 245.936 291.241 263.937C296.036 295.669 302.885 315.9 306.242 330.319C307.842 337.192 307.816 342.922 306.932 346.874C306.52 348.713 304.279 349.444 302.704 349.688C301.13 349.933 299.803 349.472 298.014 349.234C296.225 348.997 294.014 348.997 293.076 348.997" stroke="#477331" stroke-width="151" stroke-linecap="round"/>
                            <path d="M425.647 149.133C426.817 149.421 427.986 149.709 429.153 149.997C432.909 146.215 436.95 142.451 441.298 138.736C451.408 130.099 462.021 122.725 472.794 116.19C483.568 109.654 494.044 103.773 505.865 98.9852C529.931 89.2377 547.791 82.3494 545.857 79.4903C544.912 78.0938 540.932 77.1721 535.981 76.4738C531.03 75.7756 525.281 75.3148 466.825 79.1202C408.368 82.9256 300.473 90.7599 244.931 94.677C189.389 98.5942 186.294 98.5942 183.835 98.8316C181.376 99.069 179.607 99.5298 178.039 100.472C176.472 101.415 175.145 102.798 175.393 104.201C175.641 105.605 177.26 107.342 178.977 107.916C185.932 110.241 194.775 113.254 203.104 115.359C210.48 117.223 229.634 119.747 263.939 127.013C279.301 130.267 291.431 131.414 300.051 132.347C306.503 133.046 317.526 132.639 330.891 135.147C339.56 136.774 360.122 138.418 388.59 143.072C407.042 146.089 416.085 146.78 425.647 149.133Z" fill="url(#pattern1_1617_2073)"/>
                            <path d="M76 109.766C76.8844 111.609 80.8775 115.324 93.0914 126.887C102.052 135.37 115.476 150.432 124.748 161.715C139.41 179.557 146.979 199.49 153.23 219.251C157.182 231.744 158.167 245.602 160.847 260.943C164.557 282.177 166.221 303.333 167.996 324.65C169.121 338.154 171.54 357.028 173.564 370.909C176.81 393.179 184.485 412.692 193.409 430.371C200.898 445.207 218.815 457.882 233.173 464.46C242.257 468.621 266.103 467.727 297.539 469.117C322.418 470.217 336.813 474.696 343.5 477.95C357.429 484.728 372.537 496.551 385.207 512.282C408.052 540.649 418.579 564.993 421.245 571.026C424.598 578.61 430.183 584.083 433.968 587.804C440.407 594.134 449.372 592.029 458.53 589.704C465.838 587.848 469.927 580.41 474.181 574.817C478.999 568.483 486.435 558.569 489.155 549.687C490.312 545.911 491.835 541.769 492.284 499.798C492.709 460.133 491.849 383.17 491.842 341.45C491.835 299.73 492.278 295.583 492.727 275.012C493.175 254.442 493.618 217.575 492.961 197.431C492.304 177.286 490.536 174.982 488.74 173.334C485.487 170.349 481.585 168.432 475.588 164.955C465.26 158.966 445.512 154.021 425.647 149.133C416.085 146.78 407.042 146.089 388.59 143.072C360.122 138.418 339.56 136.774 330.891 135.147C317.526 132.639 306.503 133.046 300.051 132.347C291.431 131.414 279.301 130.267 263.939 127.013C229.634 119.747 210.48 117.223 203.104 115.359C194.775 113.254 185.932 110.241 178.977 107.916C177.26 107.342 175.641 105.605 175.393 104.201C175.145 102.798 176.472 101.415 178.039 100.472C179.607 99.5298 181.376 99.069 183.835 98.8316C186.294 98.5942 189.389 98.5942 244.931 94.677C300.473 90.7599 408.368 82.9256 466.825 79.1202C525.281 75.3148 531.03 75.7756 535.981 76.4738C540.932 77.1721 544.912 78.0938 545.857 79.4903C547.791 82.3494 529.931 89.2377 505.865 98.9852C494.044 103.773 483.568 109.654 472.794 116.19C462.021 122.725 451.408 130.099 441.298 138.736C421.057 156.029 407.47 174.395 398.332 190.637C388.296 208.473 385.991 227.462 385.093 247.159C384.532 259.47 385.964 276.535 387.083 287.853C388.202 299.172 389.528 304.241 392.644 330.816C395.759 357.391 400.623 405.318 402.908 430.7C405.192 456.081 404.75 457.463 403.638 457.715C402.526 457.966 400.757 457.044 387.686 428.919C374.614 400.794 350.294 345.493 332.901 300.414C315.508 255.336 305.779 222.155 300.547 203.219C292.29 173.338 289.512 161.939 286.39 155.641C284.654 152.138 282.37 149.343 280.139 148.868C273.367 147.426 278.779 163.74 281.66 183.361C284.2 200.661 288.521 232.936 291.241 250.937C296.036 282.669 302.885 302.9 306.242 317.319C307.842 324.192 307.816 329.922 306.932 333.874C306.52 335.713 304.279 336.444 302.704 336.688C301.13 336.933 299.803 336.472 298.014 336.234C296.225 335.997 294.014 335.997 293.076 335.997" stroke="#9AD345" stroke-width="151" stroke-linecap="round"/>
                            <defs>
                            <pattern id="pattern0_1617_2073" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlinkHref="#image0_1617_2073" transform="matrix(0.00210389 0 0 0.00209784 -0.486033 -0.440072)"/>
                            </pattern>
                            <pattern id="pattern1_1617_2073" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlinkHref="#image0_1617_2073" transform="matrix(0.00210389 0 0 0.00209784 -0.486033 -0.440072)"/>
                            </pattern>
                            <image id="image0_1617_2073" width="940" height="940" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6wAAAOsCAYAAABOOztEAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFKmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlv..."/>
                            </defs>
                        </svg>
                    </div>
                    <div className="max-w-[700px] mx-auto px-16 flex flex-col items-center justify-center text-center min-h-[400px] z-10">
                        <p className="title-font text-[48px] font-extrabold mb-4">Your meal, Your choice</p>
                        <p className="font-semibold text-[#757575] mb-8">Vote daily on your preferred meals and help the canteen prepare exactly what’s in demand; fresher, tastier, and waste-free.</p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="cursor-pointer px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                        >
                            Vote now
                        </button>
                    </div>
                </section>
                <section className="min-h-[120px] flex items-center justify-center w-full">
                    <CountdownTimer hours={23} minutes={59} seconds={59}/>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;