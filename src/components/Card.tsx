import { HTMLProps } from "react";

export default function Card(props: HTMLProps<HTMLDivElement>) {
    return (
        <>
            <div
                {...props}
                className={`card-component border rounded-2xl p-6 ${props.className}`}>
                {props.children}
            </div>
            <style>{`
                .card-component {
                    background: var(--bg-card);
                    border-color: var(--border-color);
                    box-shadow: 0 2px 10px var(--shadow-color);
                    transition: all 0.3s ease;
                }
                .card-component:hover {
                    box-shadow: 0 4px 20px var(--shadow-color);
                    border-color: var(--accent-color);
                }
            `}</style>
        </>
    )
}
