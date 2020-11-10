import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import 'rxjs/add/operator/takeUntil';
import { BaseComponent } from '../../../lib/base-component';
declare var $: any;

@Component({
  selector: 'app-hopdong',
  templateUrl: './hopdong.component.html',
  styleUrls: ['./hopdong.component.css']
})
export class HopdongComponent extends BaseComponent implements OnInit {
  public hopdongs: any ;
  public Hopdong: any;
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
      'mahopdong': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/Hopdong/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.hopdongs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/Hopdong/search',{page: this.page, pageSize: this.pageSize, mahopdong: this.formsearch.get('mahopdong').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.hopdongs = res.data;
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
          mahopdong:value.mahopdong,
          makhachhang:value.makhachhang,
          tenkhachhang:value.tenkhachhang,
          sodienthoai:value.sodienthoai                         
          };
        this._api.post('/api/Hopdong/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          
      });
    } else { 
      
        let tmp = {
          mahopdong:value.mahopdong,
          makhachhang:value.makhachhang,
          tenkhachhang:value.tenkhachhang,
          sodienthoai:value.sodienthoai            
          };
        this._api.post('/api/Hopdong/update-hopdong',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/Hopdong/delete-hopdong',{mahopdong:row.mahopdong}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.hopdongs = null;
    this.formdata = this.fb.group({
        'mahopdong': ['', Validators.required],
        'makhachhang': ['', Validators.required],
        'tenkhachhang': ['', Validators.required],
        'sodienthoai': ['', Validators.required]
    } ); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.hopdongs = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'mahopdong': ['', Validators.required],
        'makhachhang': ['', Validators.required],
        'tenkhachhang': ['', Validators.required],
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
      this._api.get('/api/Hopdong/get-by-id/'+ row.mahopdong).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.hopdongs = res; 
       
          this.formdata = this.fb.group({
            'mahopdong': [this.hopdongs.mahopdong, Validators.required],
            'makhachhang': [this.hopdongs.makhachhang, Validators.required],
            'tenkhachhang': [this.hopdongs.tenkhachhang, Validators.required],
            'sodienthoai': [this.hopdongs.sodienthoai, Validators.required]
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }


  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
