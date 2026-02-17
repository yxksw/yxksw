import Title from "../components/Title";
import { Book, AlertCircle } from "lucide-react";
import config from "../../config";
import { extractFromXml } from '@extractus/feed-extractor'
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Skeleton from "../components/Skeleton";
import Animation from "../components/Animation";

interface BlogProps {
    title: string
    link: string
    published: string
    description: string
}

export default function BlogView() {
    const { BlogUrl, BlogRSS } = config
    const [blogs, setBlogs] = useState<BlogProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true)
                setError("")
                
                // 尝试使用 fetch 获取 RSS
                const response = await fetch(BlogRSS, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
                    }
                })
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const xmlText = await response.text()
                const result = extractFromXml(xmlText) as any
                
                if (result && result.entries) {
                    setBlogs(result.entries)
                } else {
                    throw new Error('解析 RSS 失败')
                }
            } catch (err: any) {
                console.error('获取博客失败:', err)
                setError(err.message || 'Failed to fetch')
                
                // 如果有缓存，使用缓存数据
                const cached = localStorage.getItem('blog-cache')
                if (cached) {
                    try {
                        const parsed = JSON.parse(cached)
                        setBlogs(parsed)
                        setError('已显示缓存数据')
                    } catch {
                        // 忽略缓存解析错误
                    }
                }
            } finally {
                setLoading(false)
            }
        }

        if (BlogRSS) {
            fetchBlogs()
        }
    }, [BlogRSS])

    // 缓存博客数据
    useEffect(() => {
        if (blogs.length > 0 && !error) {
            localStorage.setItem('blog-cache', JSON.stringify(blogs))
        }
    }, [blogs, error])

    return (
        <Animation id="blog">
            <Title icon={<Book size={30} />} href={BlogUrl}>Blog</Title>
            
            {/* 错误提示 */}
            {error && (
                <Card className="mb-4 border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                </Card>
            )}
            
            {/* 博客列表 */}
            {blogs.map((blog, index) => (
                <BlogCard key={index} {...blog} />
            ))}
            
            {/* 加载骨架屏 */}
            {loading && !blogs.length && (
                new Array(4).fill(1).map((_, i) => (
                    <Skeleton key={i} className="mb-3" />
                ))
            )}
            
            {/* 空状态 */}
            {!loading && !error && blogs.length === 0 && (
                <Card className="mb-3 text-center text-slate-500 py-8">
                    暂无博客文章
                </Card>
            )}
        </Animation>
    )
}

function BlogCard(props: BlogProps) {
    // 清理描述中的 HTML 标签
    const cleanDescription = props.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || ''
    
    return (
        <Card className="mb-3 md:hover:scale-105 transition-all">
            <a href={props.link} target="_blank" rel="noopener noreferrer" title={props.title}>
                <h2 className="text-lg font-bold break-all flex items-center mb-3 text-slate-800 hover:text-slate-600"> 
                    {props.title} 
                </h2>
                <p className="text-slate-500 text-sm mb-3 break-all line-clamp-2"> 
                    {cleanDescription} 
                </p>
                <p className="text-slate-400 text-xs"> 
                    {props.published?.substring(0, 10) || ''} 
                </p>
            </a>
        </Card>
    )
}
