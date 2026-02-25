import Card from "../components/Card"
import config from "../../config";
import { Github, Book, Youtube, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import request from "umi-request";
import { marked } from "marked";
import Skeleton from "../components/Skeleton";
import Animation from "../components/Animation";

export default function HomeView() {
  const { Name, Desc, HomeMD, GithubUsername, Avatar } = config;
  const [introduce, setIntroduce] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!HomeMD) {
      return
    }
    request.get(
      HomeMD === "Github" ?
        `https://raw.githubusercontent.com/${GithubUsername}/${GithubUsername}/main/README.md`
        : HomeMD
    ).then((res) => {
      setIntroduce(marked.parse(res))
    }).catch((err) => {
      setIntroduce(`<div class="text-red-500">加载失败: ${err.message}</div>`)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <Animation id="home">
      <div className="home-header flex flex-col justify-between items-center mb-10 p-4">
        <img src={Avatar} title={Name} className="home-avatar h-32 w-32 rounded-full ring-2 mb-3" />
        <div className="text-center mt-4 md:mt-0 flex flex-col w-3/4 md:w-1/2">
          <h1 className="home-name text-2xl font-semibold mb-2">{Name}</h1>
          <p className="home-desc">{Desc}</p>
          <div className="mt-2 flex justify-center ">
            {
              getSocialLinks().map((link, index) => (
                <IconLink key={index} href={link.href} icon={link.icon} />
              ))
            }
          </div>
        </div>
      </div>
      {
        HomeMD ?
          loading ?
            <Skeleton></Skeleton>
            :
            < Card
              className="prose prose-slate max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: introduce }} />
          : null
      }
      <style>{`
        .home-avatar {
          ring-color: var(--text-muted);
        }
        .home-name {
          color: var(--text-primary);
        }
        .home-desc {
          color: var(--text-secondary);
        }
        /* 修复浅色模式下 Markdown 内容颜色 */
        .prose {
          color: var(--text-primary);
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: var(--text-primary);
        }
        .prose p {
          color: var(--text-secondary);
        }
        .prose strong {
          color: var(--text-primary);
        }
        .prose li {
          color: var(--text-secondary);
        }
        .prose a {
          color: var(--accent-color);
        }
        .prose blockquote {
          color: var(--text-muted);
          border-left-color: var(--border-color);
        }
        .prose code {
          color: var(--text-primary);
          background: var(--border-color);
        }
        .prose pre {
          background: var(--bg-secondary);
        }
        .prose hr {
          border-color: var(--border-color);
        }
      `}</style>
    </Animation>
  )
}

function getSocialLinks(): { href: string, icon: JSX.Element }[] {
  const { GithubUsername, BlogUrl, YoutubeUrl, TwitterUrl } = config
  const result = []
  if (GithubUsername) {
    result.push({
      href: `https://github.com/${GithubUsername}`,
      icon: <Github />,
    })
  }

  if (BlogUrl) {
    result.push({
      href: BlogUrl,
      icon: <Book />,
    })
  }

  if (YoutubeUrl) {
    result.push({
      href: YoutubeUrl,
      icon: <Youtube />,
    })
  }

  if (TwitterUrl) {
    result.push({
      href: TwitterUrl,
      icon: <Twitter />,
    })
  }

  return result;
}

function IconLink({ href, icon }: { href: string, icon: JSX.Element }) {
  return (
    <>
      <a
        className="icon-link m-1 md-0 p-1 border rounded-lg"
        href={href} target="_blank" rel="noreferrer">
        {icon}
      </a>
      <style>{`
        .icon-link {
          background: var(--border-color);
          color: var(--text-primary);
        }
        .icon-link:hover {
          background: var(--accent-color);
          color: white;
        }
      `}</style>
    </>
  )
}

