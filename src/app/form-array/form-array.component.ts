import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.css']
})
export class FormArrayComponent {
  constructor(private fb: FormBuilder) { }
  public slabForm:any = FormGroup;
  ngOnInit(): void {
    this.slabForm = this.fb.group({
      scheme_slab_details: this.fb.array([]),
    })
  }

  newSlab(): FormGroup {
    const index = this.scheme_slab_details ? this.scheme_slab_details.length : 0;
    return this.fb.group({
      slab_from: [[], [Validators.required, Validators.pattern("^[1-9][0-9]*$"), this.validateUniq(index)]],
      slab_to: [[], [Validators.required, Validators.pattern("^[1-9][0-9]*$"), this.validateUniq(index)]],
    });
  }
  get scheme_slab_details() {
    return this.slabForm.controls['scheme_slab_details'] as FormArray;
  }

  validateUniq(index:any) {
    return (control: AbstractControl) => {
      if (control.value) {
        const formArray = control.parent
          ? (control.parent.parent as FormArray)
          : null;
        if (formArray) {
          let slab_from = parseInt(this.slabForm.value.scheme_slab_details[index].slab_from)
          let slab_to = parseInt(this.slabForm.value.scheme_slab_details[index].slab_to)
          let slab_to_prev: any
          if (slab_to <= slab_from) {
            return (slab_to <= slab_from)
              ? { fromValueShouldBeLess: true }
              : null;
          }
           // const attributes = formArray.value.map((x) => x.slab_value);
          //  return attributes.indexOf(control.value) >= 0 && attributes.indexOf(control.value) < index
          //   ? { duplicateName: true }
          //    : null;
          let prev_ind = (index > 0) ? index - 1 : 0;
          slab_to_prev = parseInt(this.slabForm.value.scheme_slab_details[prev_ind].slab_to)
          if (slab_from <= slab_to_prev && index > 0) {
            return (slab_from <= slab_to_prev)
              ? { fromValueShouldBeGreaterThanTrue: true }
              : null;
          }

        }
      }
      return
    };
  }

  getAtributeSlabFromAt(index: number) {
    if (this.scheme_slab_details) {
      return (
        (this.scheme_slab_details.at(index).get('slab_to') as FormControl), (this.scheme_slab_details.at(index).get('slab_from') as FormControl)
      )
    } else {
      return null
    }
  }

  checkValidation(index:any) {
    (this.scheme_slab_details.at(index).get('slab_from') as FormControl).updateValueAndValidity();
    (this.scheme_slab_details.at(index).get('slab_to') as FormControl).updateValueAndValidity();
  }

  addSlab(val:any,i:any) {
    if (val == 'add') {
      if (this.scheme_slab_details?.controls[i].valid) {
        this.scheme_slab_details.push(this.newSlab());
      }
    } else {
      this.scheme_slab_details.push(this.newSlab());
    }
  }

  removeSlab(slabIndex: number) {
    this.scheme_slab_details.removeAt(slabIndex);
  }
  clearForm(){
    for (let i of this.slabForm.get('scheme_slab_details').value) {
      this.scheme_slab_details.removeAt(i);
    }
  }

}
