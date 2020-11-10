import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { ApiService } from 'src/app/lib/api.service';
import 'rxjs/add/operator/takeUntil';
import { BaseComponent } from '../../../lib/base-component';
declare var $: any;

@Component({
  selector: 'app-sanpham',
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent extends BaseComponent implements OnInit {
  public sanphams: any ;
  public sanpham: any;
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
      'masanpham': [''],  
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/sanpham/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sanphams = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/sanpham/search',{page: this.page, pageSize: this.pageSize, masanpham: this.formsearch.get('masanpham').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sanphams = res.data;
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
          masanpham:value.masanpham,
          tensanpham:value.tensanpham,
          mau:value.mau,
          dongia:value.dongia,
          content:value.content,
          manhasanxuat:value.manhasanxuat,
          maloai:value.maloai                       
          };
        this._api.post('/api/sanpham/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          
      });
    } else { 
        let tmp = {
          masanpham:value.masanpham,
          tensanpham:value.tensanpham,
          mau:value.mau,
          dongia:value.dongia,
          content:value.content,
          manhasanxuat:value.manhasanxuat,
          maloai:value.maloai    
          };
        this._api.post('/api/sanpham/update-sanpham',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/sanpham/delete-sanpham',{masanpham:row.masanpham}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.sanphams = null;
    this.formdata = this.fb.group({
      'masanpham': ['', Validators.required],
        'tensanpham': ['', Validators.required],
        'mau': ['', Validators.required],
        'dongia': ['', Validators.required],
        'content': ['', Validators.required],
        'manhasanxuat': ['', Validators.required],
        'maloai': ['', Validators.required]
    } ); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.sanphams = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'masanpham': ['', Validators.required],
        'tensanpham': ['', Validators.required],
        'mau': ['', Validators.required],
        'dongia': ['', Validators.required],
        'content': ['', Validators.required],
        'manhasanxuat': ['', Validators.required],
        'maloai': ['', Validators.required]
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
      this._api.get('/api/sanpham/get-by-id/'+ row.masanpham).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.sanphams = res; 
       
          this.formdata = this.fb.group({
            'masanpham': [this.sanphams.masanpham, Validators.required],
            'tensanpham': [this.sanphams.tensanpham, Validators.required],
            'mau': [this.sanphams.mau, Validators.required],
            'dongia': [this.sanphams.dongia, Validators.required],
            'content': [this.sanphams.content, Validators.required],
            'manhasanxuat': [this.sanphams.manhasanxuat, Validators.required],
            'maloai': [this.sanphams.maloai, Validators.required],
            
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }


  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}

