import { Category, ToolType } from './types';
import { Code, PenTool, Image, Briefcase, GraduationCap, Gamepad2, Sparkles, UserCheck, Search, Zap, Wand2 } from 'lucide-react';

export const CATEGORIES: Category[] = [
  {
    id: 'coding',
    name: 'Programação',
    icon: 'Code',
    description: 'Prompts para gerar código, debugging e arquitetura.',
    systemContext: 'Você é um Engenheiro de Software Sênior e Arquiteto de Soluções.'
  },
  {
    id: 'writing',
    name: 'Escrita Criativa',
    icon: 'PenTool',
    description: 'Storytelling, copywriting e roteiros.',
    systemContext: 'Você é um Escritor Best-Seller e Copywriter premiado.'
  },
  {
    id: 'image',
    name: 'Arte Digital',
    icon: 'Image',
    description: 'Prompts detalhados para Midjourney, e Edição de Imagem AI.',
    systemContext: 'Você é um Especialista em Prompts de IA Generativa de Imagem e Diretor de Arte.'
  },
  {
    id: 'business',
    name: 'Negócios',
    icon: 'Briefcase',
    description: 'Estratégias, e-mails corporativos e análise de mercado.',
    systemContext: 'Você é um Consultor de Negócios e Estrategista Corporativo.'
  },
  {
    id: 'education',
    name: 'Educação',
    icon: 'GraduationCap',
    description: 'Planos de aula, resumos e explicações didáticas.',
    systemContext: 'Você é um Pedagogo experiente e Professor Universitário.'
  },
  {
    id: 'rpg',
    name: 'RPG & Jogos',
    icon: 'Gamepad2',
    description: 'Criação de mundos, NPCs e mecânicas de jogo.',
    systemContext: 'Você é um Dungeon Master lendário e Game Designer.'
  }
];

export const TOOLS = [
  {
    id: ToolType.GENERATOR,
    name: 'Gerador',
    icon: 'Sparkles',
    description: 'Crie um prompt do zero a partir de uma ideia simples.'
  },
  {
    id: ToolType.REFINER,
    name: 'Refinador',
    icon: 'Zap',
    description: 'Melhore um prompt existente para máxima eficácia.'
  },
  {
    id: ToolType.PERSONA,
    name: 'Persona',
    icon: 'UserCheck',
    description: 'Crie instruções de sistema para personas específicas.'
  },
  {
    id: ToolType.ANALYZER,
    name: 'Analisador',
    icon: 'Search',
    description: 'Receba feedback crítico sobre seus prompts atuais.'
  },
  {
    id: ToolType.IMAGE_EDITOR,
    name: 'Editor Mágico',
    icon: 'Wand2',
    description: 'Edite imagens reais usando instruções de texto.'
  }
];