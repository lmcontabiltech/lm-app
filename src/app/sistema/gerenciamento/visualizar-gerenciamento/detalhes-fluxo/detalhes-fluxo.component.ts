import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessoService } from 'src/app/services/gerenciamento/processo.service';
import ApexTree from 'apextree';
import type { Node } from 'apextree/lib/models/Graph';

type TreeDirection = 'left' | 'top' | 'right' | 'bottom';
type TreeOptions = {
  width: number;
  height: number;
  direction: TreeDirection;
  contentKey: string;
  siblingSpacing: number;
  childrenSpacing: number;
  highlightOnHover: boolean;
  containerClassName: string;
  canvasStyle: string;
  enableToolbar: boolean;
  nodeWidth: number;
  nodeHeight: number;
  nodeBGColor: string;
  nodeBGColorHover: string;
  nodeStyle: string;
  nodeClassName: string;
  nodeTemplate: any;
  borderRadius: string;
  borderWidth: number;
  borderColor: string;
  borderStyle: string;
  borderColorHover: string;
  enableExpandCollapse: boolean;
  enableTooltip: boolean;
  tooltipId: string;
  tooltipTemplate: any;
  tooltipMaxWidth: number;
  tooltipBorderColor: string;
  tooltipBGColor: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: number;
  fontColor: string;
  edgeWidth: number;
  edgeColor: string;
  edgeColorHover: string;
};

@Component({
  selector: 'app-detalhes-fluxo',
  templateUrl: './detalhes-fluxo.component.html',
  styleUrls: ['./detalhes-fluxo.component.css'],
})
export class DetalhesFluxoComponent implements OnInit {
  nomeProcesso: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private processoService: ProcessoService
  ) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  ngAfterViewInit() {
    const wrapper = document.querySelector('.tree-wrapper') as HTMLElement;
    if (wrapper) {
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;

      const id = this.route.snapshot.paramMap.get('id');
      if (!id) return;

      const options: TreeOptions = {
        width,
        height,
        direction: 'top',
        contentKey: 'name',
        siblingSpacing: 30,
        childrenSpacing: 180,
        highlightOnHover: true,
        containerClassName: 'apex-tree-container',
        canvasStyle: 'background: #f6f6f6;',
        enableToolbar: true,
        nodeWidth: 180,
        nodeHeight: 64,
        nodeBGColor: '#ffffff',
        nodeBGColorHover: '#d7d7d7',
        nodeStyle: 'display: flex; align-items: center; justify-content: center;',
        nodeClassName: '',
        nodeTemplate: (name: string) => {
          console.log('nodeTemplate name:', name);
          return `<div style="text-align: center;">${name}</div>`;
        },
        borderRadius: '8px',
        borderWidth: 2,
        borderColor: '#388ac4',
        borderStyle: 'solid',
        borderColorHover: '#388ac4',
        enableExpandCollapse: true,
        enableTooltip: true,
        tooltipId: 'apex-tree-tooltip',
        tooltipTemplate: undefined,
        tooltipMaxWidth: 400,
        tooltipBorderColor: '#388ac4',
        tooltipBGColor: '#fff',
        fontSize: '18px',
        fontFamily: 'Quicksand, sans-serif',
        fontWeight: 600,
        fontColor: '#388ac4',
        edgeWidth: 4,
        edgeColor: '#bdbdbd',
        edgeColorHover: '#388ac4',
      };

      this.processoService.getProcessoById(id).subscribe((processo) => {
        this.nomeProcesso = processo.nome;
        const data: Node = {
          id: String(processo.id),
          name: processo.nome,
          expanded: true,
          children: (processo.subprocessos || []).map((sub) => ({
            id: String(sub.id),
            name: sub.tarefa,
            expanded: true,
            children: [],
          })),
        };

        const container = document.getElementById('svg-tree');
        if (container) {
          const tree = new ApexTree(container, options);
          tree.render(data);
        }
      });
    }
  }
}
