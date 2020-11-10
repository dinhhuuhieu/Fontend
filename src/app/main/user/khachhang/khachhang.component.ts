import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import 'rxjs/add/operator/takeUntil';
import { BaseComponent } from '../../../lib/base-component';
declare var $: any;

@Component({
  selector: 'app-khachhang',
  templateUrl: './khachhang.component.html',
  styleUrls: ['./khachhang.component.css']
})
export class KhachhangComponent extends BaseComponent implements OnInit {
  public khachhangs: any ;
  public Khachhang: any;
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
      'tenkhachhang': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/Khachhang/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.khachhangs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/Khachhang/search',{page: this.page, pageSize: this.pageSize, tenkhachhang: this.formsearch.get('tenkhachhang').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.khachhangs = res.data;
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
          makhachhang:value.makhachhang,
          tenkhachhang:value.tenkhachhang,
          diachi:value.diachi,
          sodienthoai:value.sodienthoai                        
          };
        this._api.post('/api/Khachhang/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          
      });
    } else { 
      
        let tmp = {
          makhachhang:value.makhachhang,
          tenkhachhang:value.tenkhachhang,
          diachi:value.diachi,
          sodienthoai:value.sodienthoai            
          };
        this._api.post('/api/Khachhang/update-khachhang',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/Khachhang/delete-khachhang',{makhachhang:row.makhachhang}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.khachhangs = null;
    this.formdata = this.fb.group({
      'makhachhang': ['', Validators.required],
      'tenkhachhang': ['', Validators.required],
      'diachi': ['', Validators.required],
      'sodienthoai': ['', Validators.required]
    } ); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.khachhangs = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'makhachhang': ['', Validators.required],
        'tenkhachhang': ['', Validators.required],
        'diachi': ['', Validators.required],
        'sodienthoai': ['', Validators.required]
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
      this._api.get('/api/Khachhang/get-by-id/'+ row.makhachhang).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.khachhangs = res; 
       
          this.formdata = this.fb.group({
            'makhachhang': [this.khachhangs.makhachhang, Validators.required],
            'tenkhachhang': [this.khachhangs.tenkhachhang, Validators.required],
            'diachi': [this.khachhangs.diachi, Validators.required],
            'sodienthoai': [this.khachhangs.sodienthoai, Validators.required]
            
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }


  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
