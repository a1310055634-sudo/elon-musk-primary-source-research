import type { Metadata } from "next";
import { ResearchApp } from "./ResearchApp";

export const metadata: Metadata = {
  title: "马斯克行为学习实验室",
  description: "基于公开可核验资料，研究马斯克的决策与沟通模式，并转化为个人行动训练。",
};

export default function Home() {
  return <ResearchApp />;
}
