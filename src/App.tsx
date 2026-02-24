import { Route, Routes, Link, useLocation, Outlet } from "react-router-dom";
import { Home, Github, Book, Film, Link2, Laptop } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BangumiView from "./view/BangumiView";
import BlogView from "./view/BlogView";
import GithubView from "./view/GithubView";
import HomeView from "./view/HomeView";
import FriendsView from "./view/FriendsView";
import FCircleView from "./view/FCircleView";
import ShuoshuoView from "./view/ShuoshuoView";
import SponsorView from "./view/SponsorView";
import EquipmentView from "./view/EquipmentView";
import MusicCapsule from "./components/MusicCapsule";
import { useEffect } from "react";

export default function App() {
  const location = useLocation()
  const isWidePage = location.pathname === '/friends' || location.pathname === '/fcircle'

  // 切换页面自动滚动到顶部
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }, 100);
  }, [location])

  return (
    <>
      <div className={`p-5 m-auto pt-40 pb-40 ${isWidePage ? 'md:w-4/5 max-w-7xl' : 'md:w-3/5'}`}>
        <Routes>
          <Route path="/" element={<HomeView />}></Route>
          <Route path="/github" element={<GithubView />}></Route>
          <Route path="/blog" element={<BlogView />}></Route>
          <Route path="/bangumi" element={<BangumiView />}></Route>
          <Route path="/friends" element={<FriendsView />}></Route>
          <Route path="/fcircle" element={<FCircleView />}></Route>
          <Route path="/shuoshuo" element={<ShuoshuoView />}></Route>
          <Route path="/sponsor" element={<SponsorView />}></Route>
          <Route path="/equipment" element={<EquipmentView />}></Route>
        </Routes>
      </div>
      <Nav />
      <MusicCapsule />
    </>
  )
}


function Nav() {
  const links = [
    { to: "/", text: "Home", icon: Home },
    { to: "/github", text: "Github", icon: Github },
    { to: "/blog", text: "Blog", icon: Book },
    { to: "/bangumi", text: "Bangumi", icon: Film },
  ]
  const location = useLocation()
  return (
    <div className="fixed shadow-sm bottom-0 left-0 right-0 md:bottom-5 md:left-1/2 md:right-auto md:-translate-x-1/2 h-24 border md:rounded-3xl rounded-none bg-white bg-opacity-70 backdrop-blur-xl">
      <ul className="flex justify-center items-center">
        {links.map((link, index) => (
          <li key={index}
            className={
              `h-20 w-20 m-2 rounded-2xl hover:bg-slate-200 transition-all ${location.pathname === link.to ? "bg-slate-200" : ""}`}>
            <Link to={link.to} className=" h-full flex flex-col justify-center items-center transition-all">
              <link.icon className={`transition-all m-1 ${location.pathname === link.to ? "" : " h-96"}`} />
              <span className=" overflow-hidden">{link.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}