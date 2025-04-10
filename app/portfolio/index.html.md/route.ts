import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  technologies?: string[];
}

export async function GET() {
  try {
    // Carregar dados dos projetos
    const projectsPath = path.join(process.cwd(), "public", "data", "projects.json")
    const projectsData = JSON.parse(await fs.readFile(projectsPath, "utf-8")) as Project[]

    // Gerar markdown para a página de portfólio
    let content = `# Portfólio de Projetos

Lista de projetos desenvolvidos por Caio Lombello em DevOps, Cloud e Desenvolvimento de Aplicações.

`

    // Agrupar projetos por categoria
    const categoriesMap = new Map<string, Project[]>()
    projectsData.forEach((project: Project) => {
      if (!categoriesMap.has(project.category)) {
        categoriesMap.set(project.category, [])
      }
      categoriesMap.get(project.category)?.push(project)
    })

    // Adicionar projetos agrupados por categoria
    categoriesMap.forEach((projects: Project[], category: string) => {
      content += `## ${category}\n\n`

      projects.forEach((project: Project) => {
        content += `### [${project.title}](${project.id}.html.md)\n\n`
        content += `${project.shortDescription}\n\n`
        content += `Tecnologias: ${project.technologies ? project.technologies.join(", ") : "N/A"}\n\n`
      })
    })

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Erro ao gerar markdown:", error)
    return new NextResponse("Erro ao gerar conteúdo markdown", { status: 500 })
  }
}

