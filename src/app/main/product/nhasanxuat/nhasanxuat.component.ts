import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import 'rxjs/add/operator/takeUntil';
import { BaseComponent } from '../../../lib/base-component';
declare var $: any;

@Component({
  selector: 'app-nhasanxuat',
  templateUrl: './nhasanxuat.component.html',
  styleUrls: ['./nhasanxuat.component.css']
})
export class NhasanxuatComponent extends BaseComponent implements OnInit {
  public nhasanxuats: any ;
  public nhasanxuat: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'manhasanxuat': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/Nhasanxuat/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nhasanxuats = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/Nhasanxuat/search',{page: this.page, pageSize: this.pageSize, manhasanxuat: this.formsearch.get('manhasanxuat').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nhasanxuats = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  pwdCheckValidator(control){
    var filteredStrings = {search:control.value, select:'@#!$%&*'}
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if(control.value.length < 6 || !result){
        return {matkhau: true};
    }
  }
  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      
        let tmp = {
          manhasanxuat:value.manhasanxuat,
          tennhasanxuat:value.tennhasanxuat,
          logo:value.logo,
          sdtnhasanxuat:value.sdtnhasanxuat                        
          };
        this._api.post('/api/Nhasanxuat/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          
      });
    } else { 
      
        let tmp = {
          manhasanxuat:value.manhasanxuat,
          tennhasanxuat:value.tennhasanxuat,
          logo:value.logo,
          sdtnhasanxuat:value.sdtnhasanxuat            
          };
        this._api.post('/api/Nhasanxuat/update-nhasanxuat',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/Nhasanxuat/delete-nhasanxuat',{manhasanxuat:row.manhasanxuat}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.nhasanxuats = null;
    this.formdata = this.fb.group({
      'manhasanxuat': ['', Validators.required],
        'tennhasanxuat': ['', Validators.required],
        'logo': ['', Validators.required],
        'sdtnhasanxuat': ['', Validators.required]
    } ); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.nhasanxuats = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'manhasanxuat': ['', Validators.required],
        'tennhasanxuat': ['', Validators.required],
        'logo': ['', Validators.required],
        'sdtnhasanxuat': ['', Validators.required]
      });

      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/nhasanxuat/get-by-id/'+ row.manhasanxuat).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.nhasanxuats = res; 
       
          this.formdata = this.fb.group({
            'manhasanxuat': [this.nhasanxuats.manhasanxuat, Validators.required],
            'tennhasanxuat': [this.nhasanxuats.tennhasanxuat, Validators.required],
            'logo': [this.nhasanxuats.logo, Validators.required],
            'sdtnhasanxuat': [this.nhasanxuats.sdtnhasanxuat, Validators.required]
            
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }


  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
