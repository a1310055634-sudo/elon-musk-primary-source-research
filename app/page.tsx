import type { Metadata } from "next";
import { ResearchApp } from "./ResearchApp";

export const metadata: Metadata = {
  title: "马斯克一手言行研究档案",
  description: "从原视频、原帖与正式文件出发，追踪马斯克的公开言论、公司行动与后续结果。",
};

export default function Home() {
  return <ResearchApp />;
}
