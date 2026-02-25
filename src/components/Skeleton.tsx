import { HTMLProps } from "react";
import Card from "./Card";

export default function Skeleton(props: HTMLProps<HTMLDivElement>) {
    return (
        <Card {...props} className={`${props.className}`} >
            <div className="skeleton-container animate-pulse">
                <div className="skeleton-line w-48 mb-4"></div>
                <div className="skeleton-line w-64 mb-4"></div>
                <div className="skeleton-line w-28 mb-4"></div>
            </div>
            <style>{`
                .skeleton-line {
                    height: 10px;
                    border-radius: 9999px;
                    background: var(--border-color);
                }
            `}</style>
        </Card>
    )
}
