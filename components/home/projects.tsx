import { projects } from "@/data/projects";
import ProjectCard from "./project-card";

export default function Projects() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-0">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          role={project.role}
          coverUrl={project.coverUrl}
          slug={project.slug}
        />
      ))}
    </div>
  );
}
