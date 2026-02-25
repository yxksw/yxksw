import { useEffect, useState } from "react";
import Animation from "../components/Animation";
import config from "../../config";

// 个人信息配置
const ABOUT_CONFIG = {
  // 顶部信息
  topInfo: {
    floatTextLeft: [
      { text: "博客写作者", icon: "📔" },
      { text: "摆烂摸鱼人", icon: "🍥" },
      { text: "博客魔改者", icon: "📚" },
      { text: "不算抗压之人", icon: "🦢" },
    ],
    floatTextRight: [
      { text: "社恐不太内向", icon: "☀️" },
      { text: "小说爱好者", icon: "🌞" },
      { text: "没什么技术", icon: "🧑‍💻" },
      { text: "只会 CV", icon: "🐗" },
    ],
    siteName: config.Aboutname,
    motto: "每一段旅行，都有终点。",
    avatar: config.Avatar,
  },
  // 个人信息
  personalInfo: {
    name: "异飨客",
    gender: "男",
    address: "江苏苏州",
    school: "南京工业职业技术大学",
    grade: "二〇二三级",
    major: "自动化技术与应用",
    email: "yxksw@foxmail.com",
    qq: "3813596020",
    birthday: "2005/08/15",
    bottomImg: "https://img.314926.xyz/h",
  },
  // 性格类型 (MBTI)
  personality: {
    type: "INFJ-T",
    typeName: "提倡者",
    url: "https://www.16personalities.com/ch/infj-人格",
    svg: "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/infj.avif",
  },
  // 描述和社交链接
  descriptionAndSocial: {
    description: "大家好！这里是异飨客的主页。我的昵称来自小说《诡秘之主》，你也可以称呼我克喵、钟神秀~我在这里添加我的项目、友链、说说等页面，记录我的日常、踩坑技术和资源分享。我不太进行社交，我有空的时候会回复，但我不常聊天，很社恐。如果你喜欢我的主页，欢迎来添加我的友链哦~",
    socialLinks: [
      { platform: "github", url: `https://github.com/${config.GithubUsername}`, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
        { platform: "Telegram", url: "https://t.me/yxksw_bot", icon: "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/Telegram.avif" },
        { platform: "QQMail", url: "mailto:yxksw@foxmail.com", icon: "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/Mail.avif" },
        { platform: "QQ", url: "https://qm.qq.com/q/qa7LA1qQY", icon: "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/Qq.avif" },
        { platform: "BiliBili", url: "https://space.bilibili.com/${config.BilibiliUid}", icon: "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/Bilibili.avif" },
    ],
  },
  // 技能
  skills: {
    technical: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
    ],
    general: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    ],
    learning: "正在持续学习中",
  },
  // 项目
  projects: [
    {
      name: "Cofe",
      description: "基于Github的博客",
      url: "https://github.com/yxksw/Cofe",
    },
    {
      name: "yxksw",
      description: "我的个人主页",
      url: "https://github.com/yxksw/yxksw",
      },
    {
      name: "Theme-Clarity",
      description: "基于Typecho的博客主题Clarity",
      url: "https://github.com/yxksw/Theme-Clarity",
    },
    
  ],
  // 爱好
  hobbies: ["阅读", "魔改", "编程", "小说"],
  // 评价
  evaluation: {
    thought: "思想上乐观开朗，忠于开源精神，摸鱼摆烂之人。",
    work: "工作上恪守规则，没什么创造力的枯竭之人。",
    summary: "正常的人！",
  },
};

export default function AboutView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Animation id="about">
      <div id="about-container" className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* 顶部区域 */}
        <section className="top-section">
          <div className="top-content">
            {/* 左侧浮动文字 */}
            <div className="float-texts left">
              {ABOUT_CONFIG.topInfo.floatTextLeft.map((item, index) => (
                <div key={index} className={`float-text float-text-${index + 1}`}>
                  <span className="float-icon">{item.icon}</span>
                  <span className="float-text-content">{item.text}</span>
                </div>
              ))}
            </div>

            {/* 头像 */}
            <div className="avatar-container">
              <div className="avatar-wrapper">
                <img
                  src={ABOUT_CONFIG.topInfo.avatar}
                  alt={ABOUT_CONFIG.topInfo.siteName}
                  className="avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = config.Avatar;
                  }}
                />
              </div>
            </div>

            {/* 右侧浮动文字 */}
            <div className="float-texts right">
              {ABOUT_CONFIG.topInfo.floatTextRight.map((item, index) => (
                <div key={index} className={`float-text float-text-${index + 5}`}>
                  <span className="float-text-content">{item.text}</span>
                  <span className="float-icon">{item.icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 站点名称 */}
          <div className="site-name">{ABOUT_CONFIG.topInfo.siteName}</div>

          {/* 座右铭 */}
          <div className="motto">{ABOUT_CONFIG.topInfo.motto}</div>
        </section>

        {/* 信息区域 */}
        <section className="info-section">
          {/* 左列 - 个人信息 */}
          <div className="left-column card">
            <div className="personal-info">
              <div className="vertical-title">个人信息</div>
              <div className="info-content">
                <div className="info-grid">
                  <p><strong>姓名:</strong> {ABOUT_CONFIG.personalInfo.name}</p>
                  <p><strong>性别:</strong> {ABOUT_CONFIG.personalInfo.gender}</p>
                  <p><strong>地址:</strong> {ABOUT_CONFIG.personalInfo.address}</p>
                  <p><strong>学校:</strong> {ABOUT_CONFIG.personalInfo.school}</p>
                  <p><strong>年级:</strong> {ABOUT_CONFIG.personalInfo.grade}</p>
                  <p><strong>专业:</strong> {ABOUT_CONFIG.personalInfo.major}</p>
                  <p>
                    <strong>邮箱:</strong>{" "}
                    <a href={`mailto:${ABOUT_CONFIG.personalInfo.email}`}>
                      {ABOUT_CONFIG.personalInfo.email}
                    </a>
                  </p>
                  <p><strong>QQ:</strong> {ABOUT_CONFIG.personalInfo.qq}</p>
                  <p><strong>生日:</strong> {ABOUT_CONFIG.personalInfo.birthday}</p>
                </div>
              </div>
            </div>
            <img
              className="left-column-bottom"
              src={ABOUT_CONFIG.personalInfo.bottomImg}
              alt=""
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* 右列 */}
          <div className="right-column">
            {/* 性格类型卡片 */}
            <div className="personality card">
              <div className="personality-info">
                <p className="type">{ABOUT_CONFIG.personality.type}</p>
                <p className="type_name">{ABOUT_CONFIG.personality.typeName}</p>
                <p className="learn_more">
                  点击在{" "}
                  <a
                    href={ABOUT_CONFIG.personality.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    16Personalities
                  </a>{" "}
                  上了解更多
                </p>
              </div>
              <div className="personality-svg">
                <img
                  src={ABOUT_CONFIG.personality.svg}
                  alt={ABOUT_CONFIG.personality.type}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* 描述和社交链接 */}
            <div className="description-and-social card">
              <p className="description">{ABOUT_CONFIG.descriptionAndSocial.description}</p>
              <div className="social-links">
                {ABOUT_CONFIG.descriptionAndSocial.socialLinks.map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={link.icon}
                      alt={link.platform}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 技能和项目 */}
        <section className="skills-and-projects">
          {/* 技能卡片 */}
          <div className="skills card">
            <h2 className="section-title-vertical">技能</h2>
            <div className="skills-content">
              <div className="skills-marquee-container">
                {/* 第一行 - 向左滚动 */}
                <div className="skills-marquee-row">
                  <div className="skills-marquee-content scroll-left">
                    {[...ABOUT_CONFIG.skills.technical, ...ABOUT_CONFIG.skills.technical].map((skill, index) => (
                      <div key={`row1-${index}`} className="skill-card">
                        <img
                          src={skill}
                          alt="技术图标"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* 第二行 - 向右滚动 */}
                <div className="skills-marquee-row">
                  <div className="skills-marquee-content scroll-right">
                    {[...ABOUT_CONFIG.skills.general, ...ABOUT_CONFIG.skills.general].map((skill, index) => (
                      <div key={`row2-${index}`} className="skill-card">
                        <img
                          src={skill}
                          alt="通用图标"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="learning">{ABOUT_CONFIG.skills.learning}</p>
            </div>
          </div>

          {/* 项目卡片 */}
          <div className="projects card">
            <h2 className="section-title-vertical">项目</h2>
            <div className="projects-content">
              <div className="projects-scroll-container">
                <div className="projects-scroll-content">
                  {ABOUT_CONFIG.projects.map((project, index) => (
                    <a
                      key={index}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-item"
                    >
                      <div className="project-name">{project.name}</div>
                      <div className="project-desc">{project.description}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 爱好和评价 */}
        <section className="hobbies-and-evaluation">
          {/* 爱好卡片 */}
          <div className="hobbies card">
            <div className="hobbies-content">
              <ul>
                {ABOUT_CONFIG.hobbies.map((hobby, index) => (
                  <li key={index}>{hobby}</li>
                ))}
              </ul>
            </div>
            <h2 className="section-title-vertical-bottom">爱好</h2>
          </div>

          {/* 评价卡片 */}
          <div className="evaluation card">
            <div className="evaluation-content">
              <p><strong>思想:</strong> {ABOUT_CONFIG.evaluation.thought}</p>
              <p><strong>工作:</strong> {ABOUT_CONFIG.evaluation.work}</p>
              <p><strong>总结:</strong> {ABOUT_CONFIG.evaluation.summary}</p>
            </div>
            <h2 className="section-title-vertical-bottom">评价</h2>
          </div>
        </section>
      </div>

      {/* 样式 */}
      <style>{`
        #about-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 20px 0;
        }

        /* 卡片通用样式 */
        .card {
          background: var(--bg-card);
          border-radius: 16px;
          box-shadow: 0 4px 20px var(--shadow-color);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px var(--shadow-color);
        }

        /* 顶部区域 */
        .top-section {
          background: var(--bg-card);
          border-radius: 20px;
          padding: 40px 20px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px var(--shadow-color);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
        }

        .top-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          margin-bottom: 20px;
        }

        /* 浮动文字 */
        .float-texts {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .float-texts.left {
          align-items: flex-end;
        }

        .float-texts.right {
          align-items: flex-start;
        }

        .float-text {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: var(--bg-secondary);
          border-radius: 20px;
          font-size: 13px;
          color: var(--text-secondary);
          box-shadow: 0 2px 8px var(--shadow-color);
          border: 1px solid var(--border-color);
          animation: float 3s ease-in-out infinite;
        }

        .float-text-1 { animation-delay: 0s; }
        .float-text-2 { animation-delay: 0.2s; }
        .float-text-3 { animation-delay: 0.4s; }
        .float-text-4 { animation-delay: 0.6s; }
        .float-text-5 { animation-delay: 0.1s; }
        .float-text-6 { animation-delay: 0.3s; }
        .float-text-7 { animation-delay: 0.5s; }
        .float-text-8 { animation-delay: 0.7s; }

        .float-icon {
          font-size: 12px;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        /* 头像 */
        .avatar-container {
          flex-shrink: 0;
        }

        .avatar-wrapper {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid var(--bg-secondary);
          box-shadow: 0 4px 20px var(--shadow-color);
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
          padding: 3px;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background: var(--bg-primary);
        }

        /* 站点名称和座右铭 */
        .site-name {
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .motto {
          text-align: center;
          font-size: 14px;
          color: var(--text-secondary);
          font-style: italic;
        }

        /* 信息区域 */
        .info-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .info-section {
            grid-template-columns: 1fr;
          }

          .top-content {
            flex-direction: column;
            gap: 20px;
          }

          .float-texts.left,
          .float-texts.right {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        /* 左列 - 个人信息 */
        .left-column {
          display: flex;
          flex-direction: column;
          padding: 24px;
          min-height: 400px;
        }

        .personal-info {
          display: flex;
          flex: 1;
          gap: 20px;
        }

        .vertical-title {
          writing-mode: vertical-rl;
          text-orientation: upright;
          font-size: 36px;
          font-weight: 400;
          color: transparent;
          letter-spacing: 12px;
          padding-right: 16px;
          border-right: 2px solid var(--border-color);
          font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
          -webkit-text-stroke: 1.5px var(--text-secondary);
          text-stroke: 1.5px var(--text-secondary);
        }

        .info-content {
          flex: 1;
          padding-left: 16px;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-grid p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .info-grid strong {
          color: var(--text-primary);
          font-weight: 600;
          margin-right: 4px;
        }

        .info-grid a {
          color: var(--accent-color);
          text-decoration: none;
          transition: color 0.2s;
        }

        .info-grid a:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }

        .left-column-bottom {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 16px;
          margin-top: auto;
          padding-top: 16px;
        }

        /* 右列 */
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* 性格类型卡片 */
        .personality {
          display: flex;
          padding: 24px;
          gap: 20px;
          align-items: center;
        }

        .personality-info {
          flex: 1;
        }

        .personality .type {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .personality .type_name {
          font-size: 20px;
          color: var(--text-secondary);
          margin: 0 0 12px 0;
        }

        .personality .learn_more {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
        }

        .personality .learn_more a {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 500;
        }

        .personality .learn_more a:hover {
          text-decoration: underline;
        }

        .personality-svg {
          width: 100px;
          height: 100px;
          flex-shrink: 0;
        }

        .personality-svg img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* 描述和社交链接 */
        .description-and-social {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .description-and-social .description {
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin: 0 0 16px 0;
          flex: 1;
        }

        .social-links {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--border-color);
          border-radius: 10px;
          transition: all 0.2s;
        }

        .social-links a:hover {
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-2px);
        }

        .social-links img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        /* 技能和项目 */
        .skills-and-projects {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 16px;
          margin-bottom: 20px;
          align-items: stretch;
          width: 100%;
        }

        @media (max-width: 900px) {
          .skills-and-projects {
            grid-template-columns: 1fr;
          }
        }

        /* 技能卡片 */
        .skills {
          display: flex;
          padding: 20px;
          min-height: 0;
          height: 100%;
          overflow: hidden;
        }

        .section-title-vertical {
          writing-mode: vertical-rl;
          text-orientation: upright;
          font-size: 36px;
          font-weight: 400;
          color: transparent;
          letter-spacing: 12px;
          margin: 0;
          padding-right: 16px;
          border-right: 2px solid var(--border-color);
          font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
          -webkit-text-stroke: 1.5px var(--text-secondary);
          text-stroke: 1.5px var(--text-secondary);
          flex-shrink: 0;
        }

        .skills-content {
          flex: 1;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
        }

        /* 技能滚动容器 */
        .skills-marquee-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
          flex: 1;
          overflow: hidden;
        }

        .skills-marquee-row {
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .skills-marquee-content {
          display: flex;
          gap: 12px;
          width: max-content;
        }

        .skills-marquee-content.scroll-left {
          animation: scroll-left 15s linear infinite;
        }

        .skills-marquee-content.scroll-right {
          animation: scroll-right 15s linear infinite;
        }

        .skills-marquee-row:hover .skills-marquee-content {
          animation-play-state: paused;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .skill-card {
          width: 56px;
          height: 56px;
          background: var(--border-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .skill-card:hover {
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-2px) scale(1.1);
        }

        .skill-card img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .learning {
          font-size: 13px;
          color: var(--text-muted);
          margin: 16px 0 0 0;
          font-style: italic;
        }

        /* 项目卡片 */
        .projects {
          display: flex;
          padding: 20px;
          min-height: 0;
          height: 100%;
          overflow: hidden;
        }

        .projects-content {
          flex: 1;
          padding-left: 20px;
        }

        .projects-scroll-container {
          overflow-y: auto;
          max-height: 200px;
          padding-right: 8px;
          scrollbar-width: thin;
          scrollbar-color: var(--border-color) transparent;
        }

        .projects-scroll-container::-webkit-scrollbar {
          width: 6px;
        }

        .projects-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .projects-scroll-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .projects-scroll-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .project-item {
          display: block;
          padding: 14px 16px;
          background: var(--border-color);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
          border: 1px solid transparent;
          flex-shrink: 0;
        }

        .project-item:hover {
          background: rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateX(4px);
        }

        .project-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .project-desc {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* 爱好和评价 */
        .hobbies-and-evaluation {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .hobbies-and-evaluation {
            grid-template-columns: 1fr;
          }
        }

        .hobbies {
          display: flex;
          padding: 24px;
          min-height: 200px;
        }

        .hobbies-content {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .hobbies ul {
          list-style: disc;
          padding-left: 20px;
          margin: 0;
        }

        .hobbies li {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .section-title-vertical-bottom {
          writing-mode: vertical-rl;
          text-orientation: upright;
          font-size: 36px;
          font-weight: 400;
          color: transparent;
          letter-spacing: 12px;
          margin: 0 0 0 16px;
          padding-left: 16px;
          border-left: 2px solid var(--border-color);
          font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
          -webkit-text-stroke: 1.5px var(--text-secondary);
          text-stroke: 1.5px var(--text-secondary);
          display: flex;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .evaluation {
          display: flex;
          padding: 24px;
          min-height: 200px;
        }

        .evaluation-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        }

        .evaluation-content p {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
        }

        .evaluation-content strong {
          color: var(--text-primary);
          font-weight: 600;
        }
      `}</style>
    </Animation>
  );
}
