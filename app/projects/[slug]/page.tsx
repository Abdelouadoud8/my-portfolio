import Topic from "@/components/about/topic";
import ProjectHeader from "@/components/project/project-header";
import { projects } from "@/data/projects";
import React from "react";
import Image from "next/image";
import ProjectSection from "@/components/project/project-section";
import Quote from "@/components/project/quote";
import Projects from "@/components/home/projects";
import SectionHeader from "@/components/section-header";

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((project) => project.slug === params.slug);

  if (!project) return <div>Project not found</div>;

  return (
    <div className="flex flex-col gap-20 sm:px-24 sm:py-12">
      <ProjectHeader
        title={project.title}
        subtitle={project.subtitle}
        role={project.role}
        description={project.description}
      />
      <Image
        src={project.coverUrl}
        alt={`${project.title} cover`}
        width={1920}
        height={1080}
        className="object-cover w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {project.topics.map((topic) => {
          return (
            <Topic
              title={topic.title}
              content={topic.content}
              key={topic.title}
            />
          );
        })}
      </div>
      {project.sections.map(({ id, title, subtitle, description, images }) => {
        return (
          <ProjectSection
            id={id}
            title={title}
            subtitle={subtitle}
            description={description}
            images={images}
            key={id}
          />
        );
      })}
      {project.quote && (
        <Quote
          description={project.quote?.description}
          author={project.quote?.author}
        />
      )}
      <SectionHeader title="Check more of my projects" subtitle="Projects" />
      <Projects />
    </div>
  );
}
