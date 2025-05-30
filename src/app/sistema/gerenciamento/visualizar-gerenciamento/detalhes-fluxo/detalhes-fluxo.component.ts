import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  ngAfterViewInit() {
    const data: Node = {
      id: '1',
      name: 'Diretor(a)',
      expanded: true,
      children: [
        { id: '2', name: 'Gerente A', expanded: true, children: [] },
        { id: '3', name: 'Gerente B', expanded: true, children: [{ id: '4', name: 'Supervisor A', expanded: true, children: [] }] },
      ],
    };

    const options: TreeOptions = {
      // CommonOptions
      width: 1000,
      height: 1000,
      direction: 'top',
      contentKey: 'name',
      siblingSpacing: 30,
      childrenSpacing: 180,
      highlightOnHover: true,
      containerClassName: 'apex-tree-container',
      canvasStyle: 'background: #f6f6f6;',
      enableToolbar: true,

      // NodeOptions
      nodeWidth: 180,
      nodeHeight: 50,
      nodeBGColor: '#ffffff',
      nodeBGColorHover: '#d7d7d7',
      nodeStyle: '', // string vazia, pode ser CSS inline se quiser
      nodeClassName: '',
      nodeTemplate: (name: string) => {
        console.log('nodeTemplate name:', name);
        return `<div style="text-align: center;">${name}</div>`;
      },
      borderRadius: '8px', // precisa ser string!
      borderWidth: 2,
      borderColor: '#388ac4',
      borderStyle: 'solid',
      borderColorHover: '#388ac4',
      enableExpandCollapse: true,

      // TooltipOptions
      enableTooltip: true,
      tooltipId: 'apex-tree-tooltip',
      tooltipTemplate: undefined,
      tooltipMaxWidth: 300,
      tooltipBorderColor: '#388ac4',
      tooltipBGColor: '#fff',

      // FontOptions
      fontSize: '20px',
      fontFamily: 'Quicksand, sans-serif',
      fontWeight: 600,
      fontColor: '#388ac4',

      // EdgeOptions
      edgeWidth: 2,
      edgeColor: '#bdbdbd',
      edgeColorHover: '#388ac4',
    };

    const container = document.getElementById('svg-tree');
    if (container) {
      const tree = new ApexTree(container, options);
      tree.render(data);
    }
  }
}
