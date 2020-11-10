import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import 'rxjs/add/operator/takeUntil';
import { BaseComponent } from '../../../lib/base-component';
declare var $: any;

@Component({
  selector: 'app-loai',
  templateUrl: './loai.component.html',
  styleUrls: ['./loai.component.css']
})
export class LoaiComponent extends BaseComponent implements OnInit {
  public loais: any ;
  public Loai: any;
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
      'maloai': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/Loai/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.loais = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/Loai/search',{page: this.page, pageSize: this.pageSize, maloai: this.formsearch.get('maloai').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.loais = res.data;
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
          maloai:value.maloai,
          tenloai:value.tenloai,
          content:value.content                     
          };
        this._api.post('/api/Loai/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          
      });
    } else { 
      
        let tmp = {
          maloai:value.maloai,
          tenloai:value.tenloai,
          content:value.content         
          };
        this._api.post('/api/Loai/update-loai',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/Loai/delete-loai',{maloai:row.maloai}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.loais = null;
    this.formdata = this.fb.group({
      'maloai': ['', Validators.required],
      'tenloai': ['', Validators.required],
      'content': ['', Validators.required],
      
    } ); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.loais = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'maloai': ['', Validators.required],
        'tenloai': ['', Validators.required],
        'content': ['', Validators.required],
        
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
      this._api.get('/api/Loai/get-by-id/'+ row.maloai).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.loais = res; 
       
          this.formdata = this.fb.group({
            'maloai': [this.loais.maloai, Validators.required],
            'tenloai': [this.loais.tenloai, Validators.required],
            'content': [this.loais.content, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }


  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
