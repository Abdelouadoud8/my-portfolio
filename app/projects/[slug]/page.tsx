import { projects } from "@/data/projects";
import React from "react";

function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((project) => project.slug === params.slug);

  if (!project) return <div>Project not found</div>;
  return <div>{project.title}</div>;
}
