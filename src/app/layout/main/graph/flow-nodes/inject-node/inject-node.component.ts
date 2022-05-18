import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Node, Edge, Graph, GraphEditingService } from '../../graph-editing.service';


@Component({
  selector: 'app-inject-node',
  templateUrl: './inject-node.component.html',
  styleUrls: ['./inject-node.component.scss']
})
export class InjectNodeComponent implements OnInit {
  injectForm: FormGroup;
  nodeEditing: boolean;

  constructor(private fb: FormBuilder, private gs: GraphEditingService) {
    this.nodeEditing = false;

    this.injectForm = this.fb.group({
      node_id: [null, [Validators.required, this.checkNodeId()]],
      node_type: "inject",
      node_label: null,
      node_content: null
    });

  }

  ngOnInit(): void {
  }

  get graph(): Graph {
    return this.gs.graph;
  }

  tryNode() {
    let node_id = this.injectForm.controls["node_id"].value;
    let node_label = this.injectForm.controls["node_label"].value || "";
    let node_type = this.injectForm.controls["node_type"].value;
    let node_data = {"content": this.injectForm.controls["node_content"].value};
    let node: Node = { id: node_id, label: node_label, type: node_type, properties: node_data};
    if (this.nodeEditing) {
      this.gs.editNode(node);
    } else {
      this.gs.addNode(node);
    }
    this.clearNodeInput();
  }

  deleteNode() {

  }

  clearNodeInput() {

  }

  checkNodeId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        if (!this.nodeEditing) {
          if (/[_-\s]/g.test(control.value)) {
            return { illegalCharacters: true, msg: "Can't contain any _ - or whitespaces" }
          }
          if (this.graph.nodes.filter(node => node.type == "task").find(nodo => nodo.id == control.value)) {
            return { already: true, msg: "Already exists a node with this id" };
          }
        }
      }
      return null;
    }
  }
}
