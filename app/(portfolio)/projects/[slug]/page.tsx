import { projects } from "@/data/portfolio/projects";
import ProjectHeader from "@/components/portfolio/project/project-header";
import Image from "next/image";
import Quote from "@/components/portfolio/project/quote";
import Projects from "@/components/portfolio/home/projects";
import SectionHeader from "@/components/portfolio/section-header";
import ProjectSection from "@/components/portfolio/project/project-section";
import Topic from "@/components/portfolio/about/topic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const parameters = await params;
  const project = projects.find((p) => p.slug === parameters.slug);

  if (!project) return <div>Project not found</div>;

  return (
    <div className="flex flex-col gap-20 sm:px-24 sm:py-12">
      <ProjectHeader
        title={project.title}
        subtitle={project.subtitle}
        role={project.role}
        description={project.description}
        link={project.link}
      />

      <Image
        src={project.coverUrl}
        alt={`${project.title} cover`}
        width={1920}
        height={1080}
        sizes="100vw"
        className="object-cover w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {project.topics.map((topic) => (
          <Topic
            key={topic.title}
            title={topic.title}
            content={topic.content}
          />
        ))}
      </div>

      {project.sections.map(({ id, title, subtitle, description, images }) => (
        <ProjectSection
          key={id}
          id={id}
          title={title}
          subtitle={subtitle}
          description={description}
          images={images}
        />
      ))}

      {project.quote && (
        <Quote
          description={project.quote.description}
          author={project.quote.author}
        />
      )}

      <SectionHeader title="Check more of my projects" subtitle="Projects" />
      <Projects location="project-page" />
    </div>
  );
}
