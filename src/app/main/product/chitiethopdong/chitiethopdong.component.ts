import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import 'rxjs/add/operator/takeUntil';
import { BaseComponent } from '../../../lib/base-component';
declare var $: any;
@Component({
  selector: 'app-chitiethopdong',
  templateUrl: './chitiethopdong.component.html',
  styleUrls: ['./chitiethopdong.component.css']
})
export class ChitiethopdongComponent extends BaseComponent implements OnInit {
  public chitiethopdongs: any ;
  public Chitiethopdong: any;
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
    this._api.post('/api/Chitiethopdong/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.chitiethopdongs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/Chitiethopdong/search',{page: this.page, pageSize: this.pageSize, mahopdong: this.formsearch.get('mahopdong').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.chitiethopdongs = res.data;
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
          machitiethopdong:value.machitiethopdong,
          mahopdong:value.mahopdong,
          masanpham:value.masanpham,
          soluong:value.soluong,  
          dongia:value.dongia,                       
          };
        this._api.post('/api/Chitiethopdong/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          
      });
    } else { 
      
        let tmp = {
          machitiethopdong:value.machitiethopdong,
          mahopdong:value.mahopdong,
          masanpham:value.masanpham,
          soluong:value.soluong,  
          dongia:value.dongia,            
          };
        this._api.post('/api/Chitiethopdong/update-chitiethopdong',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/Chitiethopdong/delete-chitiethopdong',{mahopdong:row.mahopdong}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.chitiethopdongs = null;
    this.formdata = this.fb.group({
      'machitiethopdong': ['', Validators.required],
      'mahopdong': ['', Validators.required],
      'masanpham': ['', Validators.required],
      'soluong': ['', Validators.required],
      'dongia': ['', Validators.required]
    } ); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.chitiethopdongs = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'machitiethopdong': ['', Validators.required],
        'mahopdong': ['', Validators.required],
        'masanpham': ['', Validators.required],
        'soluong': ['', Validators.required],
        'dongia': ['', Validators.required]
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
      this._api.get('/api/Chitiethopdong/get-by-id/'+ row.machitiethopdong).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.chitiethopdongs = res; 
       
          this.formdata = this.fb.group({
            'machitiethopdong': [this.chitiethopdongs.machitiethopdong, Validators.required],
            'mahopdong': [this.chitiethopdongs.mahopdong, Validators.required],
            'masanpham': [this.chitiethopdongs.masanpham, Validators.required],
            'soluong': [this.chitiethopdongs.soluong, Validators.required],
            'dongia': [this.chitiethopdongs.dongia, Validators.required]
            
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }


  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
