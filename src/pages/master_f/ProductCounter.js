import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, 
    // Badge,
     Card, 
    CardBody, CardHeader, 
    Col, Row, Table, Modal,
    ModalBody, ModalFooter,
    // DropdownItem,
    // DropdownMenu,
    // DropdownToggle, UncontrolledButtonDropdown,
     ModalHeader, Input, Label,InputGroup, InputGroupAddon, ButtonGroup
} from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { MdDelete, MdSearch,MdLoyalty,MdDetails} from 'react-icons/md';
import { getThemeColors } from 'utils/colors';

import * as myURL from '../urlLink'
const colors = getThemeColors();

class ProductCounter extends React.Component {

    constructor(props) {
        super(props);
        //edited by teddy 08/10/2019
        this.state = {
            result: [],
            outlet_produk: "...",
            keyword_supplier_brand: "",
            nomor_diskon: "",
            keyword_supplier: "",
            keyword_outlet: "",
            keyword_brand: "",
            filter_area: "Show_All",
            filter_counter: "masih_counter",
            sort_outlet: "out_code",
            filter_produk: "Show_All",
            filter_supplier: "Show_All",
            filter_outlet: "Show_All",
            status_info_counter: "",
            info_info_counter: "Show_All",
            orderby_print: "choose",
            brand_search_placeholder: "",
            outlet_search_placeholder: "",
            supplier_search_placeholder: "",
            nomor_surat: "",
            tipe_surat: "",
            tipe_modal_outlet: "",
            tipe_modal_supplier: "",
            cetak_produk: false,
            tampil_cetak: "none",
            table_display: "none",
            table_display2: "none",
            table_display3: "none",
            table_display4: "none",
            table_display5: "none",
            table_display6: "none",
            info_kode_outlet: "",
            info_nama_outlet: "",
            info_tanggal_buka_outlet: "",
            tanggal_tutup: "",
            info_supplier_id: "",
            info_supplier_nama: "",
            info_brand_id: "",
            info_brand_nama: "",
            nomor_surat_out: "",
            statusDisableSearch : true,
            disableOutletSearch: true,
            disableSupplierSearch: true,
            tanggalDalamDisable: true,
            tanggalLuarDisable: true,
            status_outlet_lama: true,
            disableBrandSearch: true,
            disableOutletDropdown: false,
            disableSupplierDropdown: false,
            disableBrandDropdown: false,
            jumlah_produk: 0,
            jumlah_outlet: 0,
            date1: "",
            date2: "",
            notFound:"none",
            notFound2: "none",
            notFound3: "none",
            notFound4: "none",
            notFound5: "none",
            notFound6: "none",
            show_outlet_info_counter: "none",
            show_supplier_info_counter: "none",
            display_print: "none",
            show_detail_supp: "none",
            result2:[],
            result3: [],
            result4: [],
            result5: [],
            result6: [],
            result_temporary_info: [],
            result_temporary_detail_surat: [],
            result_temporary: [],
            result_temporary_print: [],
            holidays: [],
            supplier_id:"0088",
            supplier_name:"KIJANG MAS CITRA SEJATI, PT",
            supplier_id_add:"",
            supplier_name_add:"",
            brand_id: "M00215",
            brand_name: "MADU PAHIT + PROPOLIS",
            brand_id_add: "",
            brand_name_add: "",
            supplier_and_brandType: "",
            modal_nested_parent: false,
            modal_delete: false,
            modal_nested: false,
            modal_supplier_and_brand: false,
            modal_supplier: false,
            modal_outlet:false,
            modal_info_counter: false,
            modal_surat: false,
            modal_print: false,
            modal_nested_info: false,
            modal_nested_delete: false,
            // modal_outlet_add:false
        };

        //edited by teddy 09/10/2019
        this.clear = this.clear.bind(this);
        this.canceladd = this.canceladd.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.toggle('nested_parent')
        this.getListOutletCounter();
        this.getListSupplierBrand();
        this.getHolidaysDate();
    }

    showNotification= (currMessage)=>{
        setTimeout(() => {
            if (!this.notificationSystem) {
              return;
            }
            this.notificationSystem.addNotification({
              title: <MdLoyalty />,
              message:
                currMessage,
              level: 'info',
            });
          }, 100);
    }

    getHolidaysDate() {
        var url = myURL.url_semua_holiday;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data["status"]);
            if(data["status"] == "Success") {
                console.log("tanggal: "+data["masterResponse"]);
                var temparray = [];
                data["masterResponse"].forEach(element => {
                    temparray.push(element.libur_date);
                });
                console.log("tanggal1: "+temparray);
                this.setState({ 
                    holidays: temparray
                });
            }
        });
    }

    clear(){
        this.setState({
            currentPage: 0
        });
    }

    getListOutletCounter(){ //Fungsi untuk menampilkan list data Outlet Counter berdasarkan brand dan supplier
        var urlA = myURL.url_tampil_outlet_counter
        var payload = {
            brand_kode: this.state.brand_id,
            sup_kode: this.state.supplier_id,
            out_area: this.state.filter_area,
            status_counter: this.state.filter_counter,
            tipe_sort: this.state.sort_outlet
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{
            this.setState({
                result: data["masterResponse"], 
                lastPage: data["lastPage"], 
                isLoading: false,
            });
            try{
                this.setState({                    
                    jumlah_outlet: data["masterResponse"].length // length harus di try catch/validasi agnes 26/11/2019
                })
                if(data["masterResponse"].length == 0) {
                    this.setState({
                        notFound:"block",
                        table_display: "none"
                    });
                }else {
                    this.setState({
                        notFound:"none",
                        table_display: "contents"
                    });
                }
            }catch(e){
                this.setState({                    
                    jumlah_outlet: 0,
                    notFound:"block",
                    table_display: "none"
                    // notFound:"block"
                })
            }
            
        });
        this.toggle('nested_parent')
    }

    enterPressed(event) { //Fungsi akan ke-trigger ketika user melakukan interaksi pada form
        var code = event.keyCode || event.which;
        if(code === 13) { //jika user menekan tombol "Enter"
            event.preventDefault();
            this.getListOutletCounter();
        }
    }

    validatesDataInsert(){ //Fungsi untuk melakukan validasi tanggal yang akan digunakan untuk melakukan penambahan Outlet Counter
        if(this.state.result_temporary.length == 0) {
            alert("Harus input minimal 1 outlet");
        }else if(this.state.tanggalDalamDisable == false && (!this.validateDate("dalam_kota", this.state.date1) || this.state.date1 == "")) {
            alert("Tanggal dalam kota minimal 3 hari kerja");
        }else if(this.state.tanggalLuarDisable == false && (!this.validateDate("luar_kota", this.state.date2) || this.state.date2 == "")) {
            alert("Tanggal dalam kota minimal 7 hari kerja");
        }else if(this.state.tanggalDalamDisable == false && this.state.tanggalLuarDisable == false && (!this.validateDate("dalam_kota", this.state.date1) || this.state.date1 == "") && this.validateDate("luar_kota", this.state.date2) && this.state.date2 != "") {
            alert("Tanggal dalam kota minimal 3 hari kerja");
        }else if(this.state.tanggalDalamDisable == false && this.state.tanggalLuarDisable == false && (!this.validateDate("luar_kota", this.state.date2) || this.state.date2 == "") && this.validateDate("dalam_kota", this.state.date1) && this.state.date1 != "") {
            alert("Tanggal dalam kota minimal 7 hari kerja");
        }else {
            this.setState({
                modal_nested: true
            });
        }
    }

    insertOutletCounter(brand_code, supplier_code, outlet_array) { //Fungsi untuk melakukan penambahan Outlet Counter
        var temp = 0;
        var temparray = [];
        var status_insert_outlet_lama = this.state.status_outlet_lama;

        var year = this.state.date1.substring(0,4);
        var month = this.state.date1.substring(5,7);
        var day = this.state.date1.substring(8,10);
        var temp_dalam = year + "-" + month + "-" + day;

        var year = this.state.date2.substring(0,4);
        var month = this.state.date2.substring(5,7);
        var day = this.state.date2.substring(8,10);
        var temp_luar = year + "-" + month + "-" + day;

        var payload = {
            statusInsertOutletLama: status_insert_outlet_lama,
            brand_kode: brand_code,
            sup_kode: supplier_code,
            listOutlet: outlet_array,
            update_id: "190182P",
            tgl_mulai : temp_dalam,
            tgl_mulai_luarkota : temp_luar
        }
        fetch(myURL.url_tambah_outlet_counter,{
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data=>{ 
            console.log(data["brandDetailList"]);
            console.log(data["insertResponseList"]);
            data["brandDetailList"].forEach(element => {
                this.addToResultInfo(element.brand_kode, element.brand_nama);
            });

            console.log(data["diskon_id"]);
            this.setState({
                nomor_diskon: data["diskon_id"]
            });
            
            data["insertResponseList"].forEach(element => {
                if(element.status == "Success" || data["status"] == "Invalid, Detail(s) Saved") {
                    temp+=1;
                    this.addDetailSuratIN(element.out_code, element.out_name, element.no_doc_in);
                    this.showNotification("Data Kode Outlet: "+element.out_code+" berhasil disimpan");
                }else{
                    var objectAdd = {
                        out_code: element.out_code,
                        out_name: element.out_name,
                        out_area: element.out_area
                    };
                    temparray.push(objectAdd);
                    this.state.status_outlet_lama = data["statusInsertOutletLama"];
                }
            });

            if(temp == outlet_array.length) {
                this.state.supplier_id_add = this.state.supplier_id;
                this.state.supplier_name_add = this.state.supplier_name;
                this.state.brand_id_add = this.state.brand_id;
                this.state.brand_name_add = this.state.brand_name;
                this.state.status_outlet_lama = true;
                //this.state.modal_nested_info = !this.state.modal_nested_info;
                
                this.setState({
                    result_temporary: [],
                    modal_nested: false,
                    modal_nested_parent: false,
                    modal_nested_info: !this.state.modal_nested_info
                });
                this.getListOutletCounter();
                this.showNotification("Semua Data Outlet Counter berhasil disimpan");
            }else {
                this.setState({
                    result_temporary: temparray
                });
            }
        });
    }
    
    validateDelete() { //Fungsi untuk validasi tanggal yang akan digunakan untuk melakuka Putus Counter Outlet
        if(this.validateDate("tutup", this.state.tanggal_tutup) == true) {
            this.setState({
                modal_nested_delete: true
            });
            //this.state.modal_nested_delete = true;
        }else if(this.state.tanggal_tutup == "") {
            alert("Pilih Tanggal Akhir minimal 3 hari kerja");
        }else {
            alert("Tanggal Akhir minimal 3 hari kerja");
        }
    }

    deleteOutletCounter(out_code, supp_code, brand_code){ //Fungsi untuk melakukan Putus Counter Outlet
        console.log("coba delete");
        const year = this.state.tanggal_tutup.substring(0,4);
        const month = this.state.tanggal_tutup.substring(5,7);
        const day = this.state.tanggal_tutup.substring(8,10);
        var tgl_tutup = year + "-" + month + "-" + day
        var payload={
            brand_kode: brand_code,
            update_id: "190182P",
            sup_kode : supp_code,
            out_kode : out_code,
            tgl_akhir: tgl_tutup
        }
        fetch(myURL.url_hapus_outlet_counter,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data=>{ 
            console.log(data["status"]);
            if(data["status"]==="Success"){
                console.log(data["masterResponse"][0]);
                this.state.modal_delete = false;
                this.setState({
                    modal_nested_info_out: true,
                    nomor_surat_out: data["masterResponse"][0]
                });
                this.showNotification("Kode Outlet: "+out_code+" berhasil dihapus");
                this.getListOutletCounter();
            }
            else if(data["status"]==="Invalid"){
                alert("INVALID");
            }
            else{
                alert("Gagal Menyimpan Data");
            }
        }); 
    }

    updateSelectionValueFilterByArea(evt) { //Fungsi yang akan ke trigger jika user mengubah dropdown Filter Area
        // this.setState({
        //     filter_area: evt.target.value
        // });
        this.state.filter_area = evt.target.value;
        this.getListOutletCounter();
    }

    updateSelectionValueSortOutlet(evt) { //Fungsi yang akan ke trigger jika user mengubah dropdown Sort by
        this.state.sort_outlet = evt.target.value;
        console.log(this.state.sort_outlet);
        this.getListOutletCounter();
    }

    updateSelectionValueFilterByCounter(evt) { //Fungsi yang akan ke trigger jika user mengubah dropdown Filter Counter
        console.log(evt.target.value);
        // this.setState({
        //     filter_counter: evt.target.value
        // });
        this.state.filter_counter = evt.target.value;
        if(evt.target.value == "tidak_counter") {
            this.state.action = "none";
        }else {
            this.state.action = "table-cell";
        }
        console.log(this.state.filter_counter);
        this.getListOutletCounter();
    }

    updateSelectionValueProductFilter(evt) { //Fungsi yang akan ke trigger jika user mengubah dropdown Pilihan untuk melakukan search Produk untuk mendapatkan data Brand dan Supplier
        this.setState({
            filter_produk: evt.target.value
        });

        if(evt.target.value != "Show_All") {
            // this.setState({
            //     statusDisableSearch: false
            // });
            this.state.statusDisableSearch = false;
            if(evt.target.value == "product_code") {

            }else if(evt.target.value == "product_name") {

            }else if(evt.target.value == "brand_name") {

            }else if(evt.target.value == "supplier_name") {

            }else{
                this.getListSupplierBrand(); // ??? by agnes
            }
        }else {
            // this.setState({
            //     keyword_supplier_brand: "",
            //     statusDisableSearch: true
            // });
            this.state.keyword_supplier_brand = "";
            this.state.statusDisableSearch = true;
        }
    }

    updateSelectionValueStatusInfoCounter(evt) { //Fungsi akan dilakukan jika user mengubah pilihan dropdown Status pada Info Counter
        this.setState({
            status_info_counter: evt.target.value,
            info_supplier_id: "",
            info_supplier_nama: "",
            info_brand_id: "",
            info_brand_nama: ""
        });
    }

    updateSelectionValueInfoInfoCounter(evt) { //Fungsi akan dilakukan jika user mengubah pilihan dropdown Info By pada Info Counter
        this.setState({
            info_info_counter: evt.target.value
        });

        if(evt.target.value == "outlet_info_counter") {
            this.setState({
                show_outlet_info_counter: "block",
                show_supplier_info_counter: "none",
                info_supplier_id: "",
                info_supplier_nama: "",
                info_brand_id: "",
                info_brand_nama: ""
            });
        }else if(evt.target.value == "supplier_info_counter"){
            this.setState({
                show_supplier_info_counter: "block",
                show_outlet_info_counter: "none",
                info_kode_outlet: "",
                info_nama_outlet: "",
                info_tanggal_buka_outlet: "",
            });
        }else {
            this.setState({
                show_supplier_info_counter: "none",
                show_outlet_info_counter: "none",
                info_supplier_id: "",
                info_supplier_nama: "",
                info_brand_id: "",
                info_brand_nama: "",
                info_kode_outlet: "",
                info_nama_outlet: "",
                info_tanggal_buka_outlet: "",
            });
        }
    }

    viewInfoCounterOutlet() { //Fungsi untuk menampilkan data Outlet Info Counter
        var urlA = myURL.url_view_info_counter_outlet;
        var payload={
            out_kode: this.state.info_kode_outlet,
            out_name: this.state.info_nama_outlet,
            out_dateopen: this.state.info_tanggal_buka_outlet,
            status: this.state.status_info_counter
        };
        fetch(urlA, {
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data=>{ 
            console.log(data["status"]);
            if(data["status"] == "Success") {
                var url = myURL.url_link_pdf_info_counter_out+this.state.info_kode_outlet+'&'+this.state.info_tanggal_buka_outlet+'&info_counter_outlet';
                window.open(url, "_blank");
            }
        });
    }

    viewInfoCounterSupplier() { //Fungsi untuk menampilkan data Supplier Info Counter
        var urlA = myURL.url_view_info_counter_supplier;
        var payload={
            sup_kode: this.state.info_supplier_id,
            sup_name: this.state.info_supplier_nama,
            brand_kode: this.state.info_brand_id,
            brand_name: this.state.info_brand_nama,
            status: this.state.status_info_counter
        };
        fetch(urlA, {
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data=>{ 
            console.log(data["status"]);
            if(data["status"] == "Success") {
                var url = myURL.url_link_pdf_info_counter_sup+this.state.info_supplier_id+'&'+this.state.info_brand_id+'&info_counter_supplier';
                window.open(url, "_blank");
            }
        });
    }

    viewInfoCounter() { //Fungsi untuk menentukan apakah Outlet atau Supplier yang akan ditampilkan pada Info Counter
        if(this.state.info_info_counter == "outlet_info_counter") {
            if(this.state.info_kode_outlet != "") {
                this.viewInfoCounterOutlet();
            }else {
                alert("Pilih Outlet terlebih dahulu");
            }
        }else if(this.state.info_info_counter == "supplier_info_counter") {
            if(this.state.info_supplier_id != "" && this.state.info_brand_id != "") {
                this.viewInfoCounterSupplier();
            }else {
                alert("Pilih Supplier terlebih dahulu");
            }
        }else {
            alert("Pilih Info By terlebih dahulu");
        }
    }

    updateSearchValueNomorSurat(evt) { //fungsi akan ke trigger jika user memberikan input pada form Pop up Surat
        this.setState({
            nomor_surat: evt.target.value
        });
    }

    handleTipeSurat(evt) { //fungsi akan ke trigger jika user memilih radio button pada Pop up Surat
        this.setState({
            tipe_surat: evt.target.value
        });

        if(evt.target.value == "in") {
            this.setState({
                tampil_cetak: "block"
            });
        }else {
            this.setState({
                tampil_cetak: "none",
                cetak_produk: false
            });
        }
    }

    printSurat() { //fungsi untuk mendownload file yang berisikan data Surat
        var payload={
            inputSearch: this.state.nomor_surat,
            inout: this.state.tipe_surat,
            cetak: this.state.cetak_produk
        }
        fetch(myURL.url_surat_counter,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data=>{ 
            console.log(data["status"]);
            if(data["status"]==="Success"){
                this.showNotification("Success");
                console.log("asdasdsa "+this.state.cetak_produk);
                if(this.state.cetak_produk){
                    var url = myURL.url_link_print_surat_prod; // apakah sudah di validasi untuk cetak produk/tidak ? - agnes 26/11/2019

                }else{
                    var url = myURL.url_link_print_surat; // apakah sudah di validasi untuk cetak produk/tidak ? - agnes 26/11/2019

                }
                window.open(url, "_blank");
            }
            else{
                alert("Data tidak ditemukan atau salah");
            }
        }); 
    }

    handleCheck() { //Fungsi saat user klik checkbox "Cetak Produk" pada layar Surat
        this.setState({
            cetak_produk: !this.state.cetak_produk
        });
    }

    deleteModalWithItemID(kode_outlet, nama_outlet, alamat, tgl_mulai, userid){ // Fungsi untuk mengatur data untuk ditampilkan saat Pop Up Hapus Counter
        this.setState({
            modal_delete: true,
            activeUserId : userid,
            out_code: kode_outlet,
            out_name: nama_outlet,
            address: alamat,
            tgl_mulaioutlet: tgl_mulai
        })
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_delete: false,
        modal_edit: false,
        modal_nested: false,
        backdrop: true,
        flagEnterSearch :false,
        flagEnterSearch2 :false,
        flagEnterSearch3 :false,
        inputtedID:""
    };

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }
        
        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`]
        });

        if(modalType === "nested_parent" && (!this.state.modal_nested_parent || this.state.modal_nested_parent)) {
            this.setState({
                result_temporary: [],
                status_outlet_lama: true,
                result_temporary_info: [],
                result_temporary_detail_surat: [],
                tanggalDalamDisable: true,
                tanggalLuarDisable: true,
                nomor_diskon: ""
                // keyword_supplier_brand: "",
                // filter_produk: "Show_All"
            });
            if(this.state.holidays.length == 0) {
                this.getHolidaysDate();
            }
            this.state.supplier_id_add= this.state.supplier_id;
            this.state.supplier_name_add= this.state.supplier_name;
            this.state.brand_id_add= this.state.brand_id;
            this.state.brand_name_add= this.state.brand_name;
            this.getListOutletToAdd();
        }

        if(modalType === "delete") {
            this.setState({
                nomor_surat_out: ""
            });
            if(this.state.holidays.length == 0) {
                this.getHolidaysDate();
            }
        }

        if(modalType === "supplier_and_brand" && this.state.modal_supplier_and_brand) {
            this.setState({
                keyword_supplier_brand: "",
                filter_produk: "Show_All",
                statusDisableSearch: true
            });
            this.getListSupplierBrand();
        }

        if(modalType === "info_counter") {
            this.setState({
                status_info_counter: "Show_All",
                info_info_counter: "Show_All",
                show_supplier_info_counter: "none",
                show_outlet_info_counter: "none",
                info_tanggal_buka_outlet: "",
                info_kode_outlet: "",
                info_nama_outlet: "",
                info_brand_id: "",
                info_brand_nama: "",
                info_supplier_id: "",
                info_supplier_nama: ""
            });
        }

        if(modalType === "surat") {
            this.setState({
                tipe_surat: "",
                cetak_produk: false,
                tampil_cetak: "none",
                nomor_surat: ""
            });
        }

        if(modalType === "print") {
            this.setState({
                orderby_print: "choose",
                display_print: "none",
                jenis_print_id: "",
                jenis_print_nama: "",
                keyword_outlet: "",
                keyword_supplier: "",
                keyword_brand: ""
            });
        }
    };

    //produk outlet
    tampil_produk_outlet(kode_outlet, nama_outlet) {
        this.setState({
            outlet_produk: nama_outlet
        });
        this.getListProductOutlet(kode_outlet);
    }

    getListProductOutlet(kode_outlet){ //fungsi untuk menampilkan produk-produk suatu outlet
        console.log("adasdsa");
        var urlA = myURL.url_tampil_produk_outlet
        var payload = {
            out_kode: kode_outlet,
            brand_kode: this.state.brand_id,
            sup_kode: this.state.supplier_id,
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{
            this.setState({
                result2:data["masterResponse"],  
                isLoading: false,
                jumlah_produk: data["masterResponse"].length
            });
            if(data["masterResponse"].length == 0) {
                this.setState({
                    notFound2:"block",
                    table_display2: "none"
                });
            }else {
                this.setState({
                    notFound2:"none",
                    table_display2: "contents"
                });
            }
        });
    }

    // supplier and brand
    getListSupplierBrand(){ //Fungsi untuk menampilkan Supplier dan Brand yang sedang aktif counter secara default
        var urlA = myURL.url_tampil_supplier_brand
        if(this.state.filter_produk == "Show_All") {
            this.state.filter_produk = "";
        }
        console.log(this.state.filter_produk);
        console.log(this.state.keyword_supplier_brand);
        var payload = {
            inputSearch: this.state.keyword_supplier_brand,
            tipeSearch: this.state.filter_produk
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{
            //agnes 26/11/2019
            try{
                this.setState({
                    result3:data["masterResponse"], 
                    isLoading: false
                });
                if(data["masterResponse"].length == 0) {
                    this.setState({
                        notFound3:"block",
                        table_display3: "none"
                    });
                }else {
                    this.setState({
                        notFound3:"none",
                        table_display3: "contents"
                    });
                }
            }catch(e){
                this.setState({
                    notFound3:"block",
                    table_display3: "none"
                });
            }
        });
    }
    
    pilihSupplierBrand(supp_id, supp_nama, brand_id, brand_nama) { //Fungsi yang berjalan jika user memilih data Supplier dan Brand untuk
        if(this.state.supplier_and_brandType == "search") {
            this.state.supplier_id = supp_id;
            this.state.supplier_name = supp_nama;
            this.state.brand_id = brand_id;
            this.state.brand_name = brand_nama;
            // this.state.supplier_id_add = supp_id;
            // this.state.supplier_name_add = supp_nama;
            // this.state.brand_id_add = brand_id;
            // this.state.brand_name_add = brand_nama;
            this.getListOutletCounter();
        }else if(this.state.supplier_and_brandType == "add") {
            this.state.supplier_id_add = supp_id;
            this.state.supplier_name_add = supp_nama;
            this.state.brand_id_add = brand_id;
            this.state.brand_name_add = brand_nama;
            this.getListOutletToAdd();
        }
        this.setState({
            modal_supplier_and_brand :!this.state.modal_supplier_and_brand,
            keyword_supplier_brand: "",
            filter_produk: "Show_All"
        });
    }

    getListOutletToAdd() { //Fungsi untuk menampilkan Outlet yang belum melakukan Counter pada Supplier dan Brand yang dipilih
        var urlA = myURL.url_tampil_tambah_outlet;
        console.log("brand: "+this.state.brand_id_add);
        console.log("sup: "+this.state.supplier_id_add);
        console.log("input: "+this.state.keyword_outlet);
        console.log("tipe: "+this.state.filter_outlet);
        var payload = {
            brand_kode: this.state.brand_id_add,
            sup_kode: this.state.supplier_id_add,
            inputSearch: this.state.keyword_outlet,
            tipeSearch: this.state.filter_outlet
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{
            // agnes 26/11/2019
            try{
                console.log(data["masterResponse"].length);
                this.setState({
                    result4:data["masterResponse"], 
                    isLoading: false
                });
                if(data["masterResponse"].length == 0) {
                    this.setState({
                        notFound4:"block",
                        table_display4: "none"
                    });
                }else {
                    this.setState({
                        notFound4:"none",
                        table_display4: "contents"
                    });
                }
            }catch(e){
                this.setState({
                    result4:data["masterResponse"], 
                    isLoading: false,
                    notFound4:"block",
                    table_display4: "none"
                });
            } 
        });
    }

    getListSupplierInfoCounter() { //Fungsi untuk menampilkan data-data Supplier pada layar Info Counter
        var urlA = myURL.url_info_counter;
        console.log(this.state.status_info_counter);
        console.log(this.state.keyword_supplier);
        console.log(this.state.info_info_counter);
        console.log(this.state.filter_supplier);
        var payload = {
            status: this.state.status_info_counter,
            inputSearch: this.state.keyword_supplier,
            tipeSearch: this.state.info_info_counter,
            modeSearch: this.state.filter_supplier
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{
            this.setState({
                result5:data["masterResponse"], 
                isLoading: false
            });
            if(data["masterResponse"].length == 0) {
                this.setState({
                    notFound5:"block",
                    table_display5: "none"
                });
            }else {
                this.setState({
                    notFound5:"none",
                    table_display5: "contents"
                });
            } 
        });
    }

    getListOutletInfoCounter() { //Fungsi untuk menampilkan data-data Outlet pada layar Info Counter
        var urlA = myURL.url_info_counter;
        console.log(this.state.status_info_counter);
        console.log(this.state.keyword_outlet);
        console.log(this.state.info_info_counter);
        console.log(this.state.filter_outlet);
        var payload = {
            status: this.state.status_info_counter,
            inputSearch: this.state.keyword_outlet,
            tipeSearch: this.state.info_info_counter,
            modeSearch: this.state.filter_outlet,
            brand_kode: ""
        };
        fetch(urlA,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data=>{
            console.log(data["masterResponse"].length);
            this.setState({
                result4:data["masterResponse"], 
                isLoading: false
            }); 
            if(data["masterResponse"].length == 0) {
                this.setState({
                    notFound4:"block",
                    table_display4: "none"
                });
            }else {
                this.setState({
                    notFound4:"none",
                    table_display4:"contents",
                });
            }
        });
    }

    pilihOutlet(kode_outlet, nama_outlet, tanggal_buka, kode_area) { //Fungsi yang akan dijalankan jika user memilih outlet
        if(this.state.tipe_modal_outlet == "info_counter"){
            this.setState({
                info_kode_outlet: kode_outlet,
                info_nama_outlet: nama_outlet,
                info_tanggal_buka_outlet: tanggal_buka,
                modal_outlet: false
            });
        }else if(this.state.tipe_modal_outlet == "tambah"){
            this.addToTemp(kode_outlet, nama_outlet, kode_area);
        }else if(this.state.tipe_modal_outlet == "print") {
            this.addToTempPrint(kode_outlet, nama_outlet);
        }
    }

    enterPressedSupplierBrand(event) { //fungsi yang akan dijalankan jika user memberikan input pada form
        var code = event.keyCode || event.which;
        if(code === 13) { //Jika input yang diberikan adalah tombol "Enter"
            event.preventDefault();
            //console.log("a Hit");
            this.getListSupplierBrand();
        }
    }

    updateSearchValueSupplierBrand(evt){ //fungsi yang akan dijalankan jika user memberikan input pada form
        this.setState({
            keyword_supplier_brand: evt.target.value
        });

        if(evt.target.value === ""){ 
            // this.setState({
            //     statusDisableSearch: true,
            //     filter_produk: "Show_All"
            // }); 
            this.state.statusDisableSearch = true;
            this.state.filter_produk = "Show_All";
            this.getListSupplierBrand();
        }
    }

    sendSearchParamSupplierBrand = param => () =>{ //Fungsi akan dijalankan saat user menekan tombol search
        this.getListSupplierBrand();
    }

    updateSearchValueOutlet(event) { //fungsi yang akan dijalankan jika user memberikan input pada form Outlet
        this.setState({
            keyword_outlet: event.target.value
        });

        if(event.target.value === ""){
            // this.setState({
            //     statusDisableSearch: true,
            //     filter_produk: "Show_All"
            // }); 
            if(this.state.tipe_modal_outlet == "info_counter") {
                this.state.disableOutletSearch = true;
                this.state.filter_outlet = "Show_All";
                this.getListOutletInfoCounter();
            }else if(this.state.tipe_modal_outlet == "tambah"){
                this.state.disableOutletSearch = true;
                this.state.filter_outlet = "Show_All";
                this.getListOutletToAdd();
            }else if(this.state.tipe_modal_outlet == "print") {

            }
            //this.getListSupplierBrand();
        }
    }

    enterSearchPressedOutlet(event) { //fungsi yang akan dijalankan jika user memberikan input pada form Outlet
        var code = event.keyCode || event.which;
        if(code === 13) { //Jika input yand diberikan adalah tombol "Enter"
            event.preventDefault();
            console.log("a Hit");
            if(this.state.tipe_modal_outlet == "info_counter") {
                this.getListOutletInfoCounter();
            }else if(this.state.tipe_modal_outlet == "tambah"){
                this.getListOutletToAdd();
            }else if(this.state.tipe_modal_outlet == "print"){
                this.getDataPrint();
            }
        }
    }

    sendSearchOutletParams() { //Fungsi akan berjalan saat user menekan tombol search pada Outlet
        if(this.state.tipe_modal_outlet == "info_counter") {
            this.getListOutletInfoCounter();
        }else if(this.state.tipe_modal_outlet == "tambah"){
            this.getListOutletToAdd();
        }else if(this.state.tipe_modal_outlet == "print"){
            this.getDataPrint();
        }
    }

    updateSelectionValueOutlet(event) { //Fungsi yg akan berjalan saat user memilih dropdown pada Outlet
        this.setState({
            filter_outlet: event.target.value
        });

        if(event.target.value != "Show_All") {
            // this.setState({
            //     statusDisableSearch: false
            // });
            this.state.disableOutletSearch = false;
            if(event.target.value == "outlet_name"){
                this.state.outlet_search_placeholder = "Cari nama outlet";
            }else if(event.target.value == "outlet_code"){
                this.state.outlet_search_placeholder = "Cari kode outlet";
            }
        }else {
            // this.setState({
            //     keyword_supplier_brand: "",
            //     statusDisableSearch: true
            // });
            this.state.keyword_outlet = "";
            this.state.disableOutletSearch = true;
            // if(this.state.tipe_modal_outlet == "tambah") {
            //     this.getListOutletToAdd();
            // }else if(this.state.tipe_modal_outlet == "info_counter") {
            //     this.getListOutletInfoCounter();
            // }
        }
    }

    updateSearchValueSupplier(event) { //fungsi yang akan dijalankan jika user memberikan input pada form Supplier
        this.setState({
            keyword_supplier: event.target.value
        });

        if(event.target.value === ""){
            // this.setState({
            //     statusDisableSearch: true,
            //     filter_produk: "Show_All"
            // }); 
            this.state.filter_supplier = "Show_All";
            this.state.disableSupplierSearch = true;
            if(this.state.tipe_modal_supplier == "info_counter") {
                this.getListSupplierInfoCounter();
            }else if(this.state.tipe_modal_supplier == "print") {

            }
            //this.getListSupplierBrand();
        }
    }

    enterSearchPressedSupplier(event) { //fungsi yang akan dijalankan jika user memberikan input pada form Outlet
        var code = event.keyCode || event.which;
        if(code === 13) { //jika user memberikan input tombol "Enter"
            event.preventDefault();
            console.log("a Hit");
            if(this.state.tipe_modal_supplier == "info_counter") {
                this.getListSupplierInfoCounter();
            }else if(this.state.tipe_modal_supplier == "print") {
                this.getDataPrint();
            }
            //this.getListSupplierBrand();
        }
    }

    sendSearchSupplierParams() { //fungsi yang akan dijalankan jika user menekan tombol search pada Supplier
        if(this.state.tipe_modal_supplier == "info_counter") {
            this.getListSupplierInfoCounter();
        }else if(this.state.tipe_modal_supplier == "print") {
            this.getDataPrint();
        }
    }

    updateSelectionValueSupplier(event) { //fungsi yang akan dijalankan jika user memilih dropdown pada form Supplier
        this.setState({
            filter_supplier: event.target.value
        });

        if(event.target.value != "Show_All") {
            // this.setState({
            //     statusDisableSearch: false
            // });
            this.state.disableSupplierSearch = false;
            if(event.target.value == "supplier_name") {
                this.state.supplier_search_placeholder = "Cari nama supplier";
            }else if(event.target.value == "supplier_code"){
                this.state.supplier_search_placeholder = "Cari kode supplier";
            }
        }else {
            // this.setState({
            //     keyword_supplier_brand: "",
            //     statusDisableSearch: true
            // });
            this.state.keyword_supplier = "";
            this.state.disableSupplierSearch = true;
            // this.getListSupplierInfoCounter();
        }
    }

    pilihSupplier(supp_id, supp_nama, brand_id, brand_nama) { //Fungsi saat user memilih Supplier 
        if(this.state.tipe_modal_supplier == "info_counter") {
            this.state.info_supplier_id = supp_id;
            this.state.info_supplier_nama = supp_nama;
            this.state.info_brand_id = brand_id;
            this.state.info_brand_nama = brand_nama;
        }else if(this.state.tipe_modal_supplier == "print") {
            this.addToTempPrint(supp_id, supp_nama);
        }
        this.setState({
            modal_supplier: !this.state.modal_supplier
        });
    }

    updateSelectionValueBrand(event) { //fungsi yang akan dijalankan jika user memilih dropdown form Brand
        this.setState({
            filter_brand: event.target.value
        });

        if(event.target.value != "Show_All") {
            // this.setState({
            //     statusDisableSearch: false
            // });
            
            if(event.target.value == "brand_code"){
                this.state.brand_search_placeholder = "Cari kode brand";
            }else if(event.target.value == "brand_name"){
                this.state.brand_search_placeholder = "Cari kode brand";
            }
        }else {
            // this.setState({
            //     keyword_supplier_brand: "",
            //     statusDisableSearch: true
            // });
            
            this.state.keyword_brand = "";
            // this.getListSupplierInfoCounter();
        }
    }

    updateSearchValueBrand(evt) { //fungsi yang akan dijalankan jika user memberikan input pada form Outlet
        this.setState({
            keyword_brand: evt.target.value
        });

        if(evt.target.value === ""){
            // this.state.disableBrandSearch = true;
            // this.state.filter_brand = "Show_All";
        }
    }

    enterSearchPressedBrand(event) { //fungsi yang akan dijalankan jika user memberikan input pada form Brand
        var code = event.keyCode || event.which;
        if(code === 13) { //Jika input yang diberikan adalah tombol "Enter"
            event.preventDefault();
            console.log("a Hit");
            this.getDataPrint();
        }
    }

    sendSearchBrandParams() { //fungsi yang akan dijalankan jika user menekan tombol search pada form Brand
        this.getDataPrint();
    }

    pilihBrand(brand_id, brand_name) { //Fungsi saat user memilih Brand
        this.addToTempPrint(brand_id, brand_name);
        this.setState({
            modal_brand: !this.state.modal_brand,
            keyword_brand: ""
        });
    }

    updateSelectionValueOrderByPrint(event) { //Fungsi saat user memilih dropdown pada Order By layar Print
        this.setState({
            orderby_print: event.target.value
        });

        if(event.target.value == "choose") {
            // this.setState({
            //     statusDisableSearch: false
            // });

            //this.state.display_print = "none";
            this.setState({
                display_print: "none"
            });
        }else {
            if(event.target.value == "Outlet") {
                this.state.jenis_print_id =  "Kode Outlet";
                this.state.jenis_print_nama =  "Nama Outlet";
            }else if(event.target.value == "Supplier") {
                this.state.jenis_print_id =  "Supplier ID";
                this.state.jenis_print_nama =  "Supplier Nama";
            }else if(event.target.value == "Brand") {
                this.state.jenis_print_id =  "Brand ID";
                this.state.jenis_print_nama =  "Brand Nama";
            }
            this.setState({
                display_print: "block"
            });
            //this.state.display_print = "block";
        }
        this.setState({
            result_temporary_print: []
        });
    }

    getDataPrint() { //Fungsi untuk mendapatkan data untuk ditampilkan pada layar Print
        if(this.state.orderby_print == "Outlet") {
            var payload = {
                tipeSearch: "outlet",
                inputSearch: this.state.keyword_outlet
            };
        }else if(this.state.orderby_print == "Supplier") {
            var payload = {
                tipeSearch: "supplier",
                inputSearch: this.state.keyword_supplier
            };
        }else if(this.state.orderby_print == "Brand") {
            var payload = {
                tipeSearch: "brand",
                inputSearch: this.state.keyword_brand
            };
        }

        fetch(myURL.url_cari_data_print,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data=>{
            console.log(data['status']);
            if(data["status"] == "Success") {
                if(this.state.orderby_print == "Outlet") {
                    this.setState({
                        result4: data["masterResponse"],
                        isLoading: false
                    });
                }else if(this.state.orderby_print == "Supplier") {
                    this.setState({
                        result5: data["masterResponse"],
                        isLoading: false
                    });
                }else if(this.state.orderby_print == "Brand") {
                    this.setState({
                        result6: data["masterResponse"],
                        isLoading: false
                    });
                    if(data["masterResponse"].length == 0) {
                        this.setState({
                            notFound6: "block",
                            table_display6: "none"
                        });
                    }else {
                        this.setState({
                            notFound6: "none",
                            table_display6: "contents"
                        });
                    }
                }
            }
        });
    }

    openPrintOrder() { //Fungsi untuk menampilkan data Outlet atau Supplier atau Brand yang akan ditampilkan
        if(this.state.orderby_print == "Outlet") {
            this.state.keyword_outlet =  "";
            this.setState({
                modal_outlet: true,
                tipe_modal_outlet: "print",
                filter_outlet: "outlet_name",
                disableOutletSearch: false,
                disableOutletDropdown: true,
                result4: [],
                outlet_search_placeholder: "Cari nama outlet"
            });
        }else if(this.state.orderby_print == "Supplier") {
            this.state.keyword_supplier =  "";
            this.setState({
                modal_supplier: true,
                tipe_modal_supplier: "print",
                filter_supplier: "supplier_name",
                disableSupplierSearch: false,
                disableSupplierDropdown: true,
                result5: [],
                supplier_search_placeholder: "Cari nama supplier"
            }); 
        }else if(this.state.orderby_print == "Brand") {
            this.state.keyword_brand =  "";
            this.setState({
                modal_brand: true,
                filter_brand: "brand_name",
                brand_search_placeholder: "Cari brand outlet",
                disableBrandDropdown: true,
                disableBrandSearch: false,
                result6: [],
            });
        }

        this.getDataPrint();
    }

    printPrint() { //Fungsi untuk mendownload file untuk fungsi Print
        if(this.state.orderby_print == "choose") {
            alert("Mohon pilih Order By terlebih dahulu");
        }else {
            if(this.state.result_temporary_print.length == 0) {
                alert("Mohon pilih data yang mau diprint minimal 1 data");
            }else {
                var url = myURL.url_print_counter;
                var array_code = [];
                this.state.result_temporary_print.forEach(element=> {
                    array_code.push(element.data_print_id);
                }); 
                console.log(this.state.orderby_print+" "+url +" " +array_code);
                if(this.state.orderby_print == "Outlet") {
                    var payload = {
                        brand_kode: [""], // edited agnes 26/11/2019 
                        sup_kode: [""],
                        out_kode: array_code
                    }
                }else if(this.state.orderby_print == "Supplier") {
                    var payload = {
                        brand_kode: [""],
                        sup_kode: array_code,
                        out_kode: [""]
                    }
                }else if(this.state.orderby_print == "Brand") {
                    var payload = {
                        brand_kode: array_code,
                        sup_kode: [""],
                        out_kode: [""]
                    }
                }
                console.log(payload);
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(payload),
                    json: true,
                    headers:{
                        "Content-type":"application/json; charset=UTF-8"
                    }
                }).then(response => response.json())
                .then(data=>{
                    console.log(data['status']);
                    if(data["status"] == "Success") {
                        var link = myURL.url_link_pdf_print;
                        window.open(link, "_blank");
                    }
                });
            }
        }
    }

    canceladd() {
        this.state.modal_nested_parent = false;
        this.setState({
            supplier_id_add : "",
            supplier_name_add:"",
            brand_id_add : "",
            brand_name_add:"",
            result_temporary: [],
        });
    }

    addToTemp(kode_outlet, nama_outlet, kode_area) {// Fungsi untuk menampung data Outlet yang dipilih untuk di insert
        var temporary_add = this.state.result_temporary;
        var find = false;
        temporary_add.forEach(element => {
            if(element.out_code == kode_outlet) {
                find = true;
            }
        });

        if(find == false) {
            var objectAdd = {
                out_code: kode_outlet,
                out_name: nama_outlet,
                out_area: kode_area
            };
            temporary_add.push(objectAdd);
            this.setState({
                result_temporary: temporary_add,
                modal_outlet :!this.state.modal_outlet,
                keyword_outlet: ""
            });
            this.checkListTambahOutlet(temporary_add);
        }else {
            alert("Outlet Kode: " + kode_outlet + " sudah dipilih")
        }
    }

    removeTemporary(kode_outlet) { // Fungsi untuk menghapus data Outlet yang dipilih untuk di insert
        var temporary_add = this.state.result_temporary;
        for(let i = 0; i<temporary_add.length; i++) {
            if(temporary_add[i].out_code == kode_outlet) {
                temporary_add.splice(i, 1);
                this.setState({
                    result_temporary: temporary_add
                });
                break;
            }
        }
        this.checkListTambahOutlet(temporary_add);
    }

    addDetailSuratIN(kode_outlet, nama_outlet, nomor_surat) { // Fungsi untuk menampung data surat dan outlet yang dipilih untuk ditampilkan saat berhasil melakukan insert
        console.log("nambah satu");
        var temporary_add = this.state.result_temporary_detail_surat;
        var find = false;
        temporary_add.forEach(element => {
            if(element.out_code == kode_outlet) {
                find = true;
            }
        });

        if(find == false) {
            var objectAdd = {
                out_code: kode_outlet,
                out_name: nama_outlet,
                no_doc_in: nomor_surat
            };
            temporary_add.push(objectAdd);
            this.setState({
                result_temporary_detail_surat: temporary_add
            });
        }else {
            console.log("sudah ada");
        }
    }

    addToResultInfo(kode_brand, nama_brand) { // Fungsi untuk menampung data Brand yang didapatkan dari backend untuk ditampilkan
        var temporary_add = this.state.result_temporary_info;
        var find = false;
        temporary_add.forEach(element => {
            if(element.brand_code == kode_brand) {
                find = true;
            }
        });

        if(find == false) {
            var objectAdd = {
                brand_code: kode_brand,
                brand_name: nama_brand
            };
            temporary_add.push(objectAdd);
            this.setState({
                result_temporary_info: temporary_add
            });
        }else {
            console.log("sudah ada");
        }
    }

    checkListTambahOutlet(list_tambah_outlet) { //Fungsi yang akan melakukan checking saat menambah atau menghapus data pada penampung data Outlet, apakah ada data Outlet Dalam Kota dan Outlet Luar Kotaa
        if(list_tambah_outlet.length == 0) {
            this.setState({
                tanggalDalamDisable: true,
                tanggalLuarDisable: true
            });
        }else {
            list_tambah_outlet.forEach(element => {
                console.log(element.out_area);
                if(element.out_area == "021" || element.out_area == "0251") {
                    console.log("dalam: "+element.out_area);
                    this.setState({
                        tanggalDalamDisable: false
                    });
                } else {
                    console.log("luar: "+element.out_area);
                    this.setState({
                        tanggalLuarDisable: false
                    });
                }
            });
        }
    }

    setTanggalTutup(event) { //Fungsi untuk menentukan data tanggal tutup saat hapus counter
        this.setState({
            tanggal_tutup: event.target.value
        });
        console.log(this.state.tanggal_tutup);
    }

    setTanggalDalam(event) { //Fungsi untuk menentukan data tanggal dalam kota saat insert
        this.setState({
            date1: event.target.value
        });
        console.log(this.state.date1);
    }

    setTanggalLuar(event) { //Fungsi untuk menentukan data tanggal luar kota saat insert
        this.setState({
            date2: event.target.value
        });
        console.log(this.state.date2);
    }

    validateDate(type, date) { //Fungsi untuk melakukan validasi antara 2 tanggal
        if(date == "") {
            return false;
        } else {
            console.log("inserted: "+date);
            const year = date.substring(0,4);
            const month = date.substring(5,7) - 1;
            console.log("month: "+month);
            const day = date.substring(8,10);
            const dest_date = new Date(year, month, day);
            console.log("destdate: "+dest_date);
            console.log("destdate hari: "+dest_date.getDay());

            const tanggal = new Date();
            const today_year = tanggal.getFullYear();
            const today_month = tanggal.getMonth();
            const today_day = tanggal.getDate() ;
            const today =  new Date(today_year, today_month, today_day);
            console.log("tooday: "+today);
            const diffTime = Math.abs(dest_date - today);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            // added agnes 26/11/2019 untuk validasi lebih dr tgl sekarang
            if(dest_date<=today){
                return false;
            }else{
                var weeks = Math.floor(diffDays / 7);
                diffDays -= weeks * 2;

                var startDay = tanggal.getDay();
                var endDay = dest_date.getDay();

                console.log("hari ini: "+startDay);
                console.log("hari pilih: "+endDay);
                if (startDay - endDay > 1) {
                    diffDays -= 2;
                }
                
                if (startDay == 0 && endDay != 6) {
                    diffDays--;  
                }

                if (endDay == 6 && startDay != 0) {
                    diffDays--;
                }

                console.log(this.state.holidays);
                this.state.holidays.forEach(day => {
                    var loop_year = day.substring(0,4);
                    var loop_month = day.substring(5,7) - 1;
                    var loop_day = day.substring(8,10);
                    var loop_date = new Date(loop_year, loop_month, loop_day);
                    if ((loop_date >= tanggal) && (loop_date <= dest_date)) {
                        console.log("ASEASDSADASDSA: "+loop_date.getDay());
                        if ((loop_date.getDay() % 6) != 0) {
                            diffDays--;
                        }
                    }
                });

                console.log("selisih: "+ diffDays);
                if(type == "dalam_kota" || type == "tutup") {
                    if(diffDays < 3) {
                        return false;
                    }else {
                        return true;
                    }
                }else if(type == "luar_kota") {
                    if(diffDays < 7) {
                        return false;
                    }else {
                        return true;
                    }
                }
            }
        }
    }

    openOutletInfoCounter() { //Fungsi untuk menampilkan Pop out outlet pada Info Counter
        this.setState({
            modal_outlet: true,
            tipe_modal_outlet: "info_counter",
            filter_outlet: "Show_All",
            keyword_outlet: "",
            disableOutletSearch: true,
            disableOutletDropdown: false,
        });
        this.getListOutletInfoCounter();
        // this.state.modal_outlet = true;
        // this.state.tipe_modal_outlet = "info_counter";
    }

    openSupplierInfoCounter() { //Fungsi untuk menampilkan Pop out supplier pada Info Counter
        this.setState({
            modal_supplier: true,
            tipe_modal_supplier: "info_counter",
            filter_supplier: "Show_All",
            keyword_supplier: "",
            show_detail_supp: "table-cell",
            disableSupplierSearch: true,
            disableOutletDropdown: false,
        });
        this.getListSupplierInfoCounter();
    }

    openTambahOutlet() { //Fungsi untuk menampilkan pop out outlet pada insert
        if(this.state.brand_id_add != "" && this.state.supplier_id_add != ""){
            this.setState({
                modal_outlet: true,
                tipe_modal_outlet: "tambah",
                filter_outlet: "Show_All",
                keyword_outlet: "",
                disableOutletSearch: true,
                disableOutletDropdown: false
            });
            
            // this.state.modal_outlet = true;
            // this.state.tipe_modal_outlet = "tambah";
        }else {
            alert("Mohon pilih supplier dan brand terlebih dahulu");
        }
        
    }

    closeAllModalInsert(){
        this.setState({
            modal_nested_parent: false,
            modal_nested: false,
            modal_nested_info: false,
            result_temporary_info: [],
            result_temporary_detail_surat: []
        });
    }

    infoNewProduk() { //Fungsi untuk download informasi produk baru brand dan supplier tertentu
        var url = myURL.url_info_produk_baru;
        console.log(this.state.supplier_id);
        console.log(this.state.supplier_name);
        console.log(this.state.brand_id);
        var payload = {
            sup_kode: this.state.supplier_id,
            sup_nama: this.state.supplier_name,
            brand_kode: this.state.brand_id,
            user_id: "190182P"
        }
        fetch(url,{
            method: 'POST',
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data=>{
            console.log(data['status']);
            if(data["status"] == "Success") {
                var link = myURL.url_link_pdf_info_new_product+this.state.supplier_id+'&brand='+this.state.brand_id;
                window.open(link, "_blank");
            }else if(data["status"] == "Failed"){
                alert("Gagal untuk menampilkan Info Produk Baru");
            }else if(data["status"] == "Invalid") {
                alert("Tidak ada Info Produk Baru");
            }
        });
    }

    addToTempPrint(data_print_id, data_print_name) { //Fungsi untuk menampung data yang akan digunakan untuk Print
        var temporary_add = this.state.result_temporary_print;
        var find = false;
        temporary_add.forEach(element => {
            if(element.data_print_id == data_print_id) {
                find = true;
            }
        });

        if(find == false) {
            var objectAdd = {
                data_print_id: data_print_id,
                data_print_name: data_print_name
            };
            temporary_add.push(objectAdd);
            this.setState({
                result_temporary_print: temporary_add
            });

            if(this.state.orderby_print == "Outlet") {
                this.setState({
                    modal_outlet :!this.state.modal_outlet,
                    keyword_outlet: ""
                });
            }else if(this.state.orderby_print == "Supplier") {
                this.setState({
                    modal_supplier :!this.state.modal_supplier,
                    keyword_supplier: ""
                });
            }else if(this.state.orderby_print == "Brand") {
                this.setState({
                    modal_brand :!this.state.modal_brand,
                    keyword_brand: ""
                });
            }
        }else {
            if(this.state.orderby_print == "Outlet") {
                alert("Kode Outlet: " + data_print_id + " sudah dipilih");
            }else if(this.state.orderby_print == "Supplier") {
                alert("Supplier ID: " + data_print_id + " sudah dipilih");
            }else if(this.state.orderby_print == "Brand") {
                alert("Brand ID: " + data_print_id + " sudah dipilih");
            }
        }
    }

    removeTemporaryPrint(data_print_id){ //Fungsi untuk menghapus data yang akan digunakan untuk Print
        var temporary_add = this.state.result_temporary_print;
        for(let i = 0; i<temporary_add.length; i++) {
            if(temporary_add[i].data_print_id == data_print_id) {
                temporary_add.splice(i, 1);
                this.setState({
                    result_temporary_print: temporary_add
                });
                break;
            }
        }
    }

    render() { //Fungsi untuk meng render data pada Front End
        const { result, currentPage, packingPerPage} = this.state;

        const currentResult = this.state.result;

        const renderOutlet = currentResult && currentResult.map((outlet) => {
            return <tr>
                <th scope="row" className="align-middle" style={{borderLeft: "2px solid #dee2e6", borderBottom: "1px solid #dee2e6"}}>{outlet.out_kode}</th>
                <td scope="row" className="align-middle" style={{borderLeft: "2px solid #dee2e6", borderBottom: "1px solid #dee2e6"}}>{outlet.out_nama}</td>
                <td scope="row" className="align-middle" style={{borderLeft: "2px solid #dee2e6", borderBottom: "1px solid #dee2e6"}}>{outlet.out_alamat}</td>
                <th scope="row" className="align-middle" style={{borderLeft: "2px solid #dee2e6", borderBottom: "1px solid #dee2e6"}}>{outlet.out_kodeArea}</th>
                <td className="align-middle" style={{display: this.state.action, borderLeft: "2px solid #dee2e6", borderRight: "2px solid #dee2e6", borderLeft: "2px solid #dee2e6", borderBottom: "1px solid #dee2e6"}}>
                    <Button title="Tampil Produk" color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "#0cfaf6", border:"none"}} onClick={() => this.tampil_produk_outlet(outlet.out_kode, outlet.out_nama)}><MdDetails/></Button> 
                    <Button title="Hapus Counter" color="secondary" size="sm" style={{marginTop:'7px', background: "red", border:"none"}} onClick={() => this.deleteModalWithItemID(outlet.out_kode, outlet.out_nama, outlet.out_alamat, outlet.out_tglMulai)}><MdDelete/></Button> 
                </td>
            </tr>
        });

        const currentResult2 = this.state.result2;

        const renderProduk = currentResult2 && currentResult2.map((product) => {
            return <tr>
                <th scope="row" style={{borderLeft: "2px solid #dee2e6", borderBottom: "1px solid #dee2e6"}}>{product.pro_kode}</th>
                <td style={{borderLeft: "2px solid #dee2e6", borderBottom: "1px solid #dee2e6"}}>{product.pro_nama}</td>
                <td style={{borderLeft: "2px solid #dee2e6", borderRight: "2px solid #dee2e6", borderBottom: "1px solid #dee2e6"}}>{product.pro_startDate}</td>
            </tr>
        });

        const currentResult3 = this.state.result3;
        const renderSupplierBrand = currentResult3 && currentResult3.map((spbrand) => {
            return <tr>
                <th scope="row" width="80px" className="align-middle" style={{paddingLeft: "3px", paddingRight: "3px"}}>{spbrand.pro_kode}</th>
                <td width="30%" className="align-middle" style={{paddingLeft: "5px", paddingRight: "5px"}}>{spbrand.pro_nama}</td>
                <td width="30%" className="align-middle" style={{paddingLeft: "5px", paddingRight: "5px"}}>
                    <Table> 
                        <tr>
                            <td style={{borderStyle: "none", paddingLeft: "0px", paddingRight: "0px"}} width="50%">
                                Brand ID
                            </td>
                            <td style={{borderStyle: "none", paddingRight: "0px"}}>
                                {spbrand.brand_kode}
                            </td>
                        </tr>
                    </Table>

                    <Table> 
                        <tr>
                            <td style={{borderStyle: "none", paddingLeft: "0px", paddingRight: "0px"}} width="50%">
                                Brand Nama
                            </td>
                            <td style={{borderStyle: "none", paddingRight: "0px"}}>
                               {spbrand.brand_nama}
                            </td>
                        </tr>
                    </Table>

                    <Table> 
                        <tr>
                            <td style={{borderStyle: "none", paddingLeft: "0px", paddingRight: "0px"}} width="50%">
                                Supplier ID
                            </td>
                            <td style={{borderStyle: "none", paddingRight: "0px"}}>
                                {spbrand.supplier_kode}
                            </td>
                        </tr>
                    </Table>

                    <Table> 
                        <tr>
                            <td style={{borderStyle: "none", paddingLeft: "0px"}} width="50%">
                                Supplier Nama
                            </td>
                            <td style={{borderStyle: "none", paddingRight: "0px"}}>
                                {spbrand.supplier_nama}
                            </td>
                        </tr>
                    </Table>
                </td>
                <td width="10%" className="align-middle" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}} onClick={() => this.pilihSupplierBrand(spbrand.supplier_kode, spbrand.supplier_nama, spbrand.brand_kode, spbrand.brand_nama)}>OK</Button> 
                </td>
            </tr>
        });

        const currentResult4 = this.state.result4;
        const renderOutletModal = currentResult4 && currentResult4.map((outlet) => {
            return <tr>
                <th scope="row">{outlet.out_kode}</th>
                <td scope="row">{outlet.out_nama}</td>
                {/* <td scope="row">{outlet.out_alamat}</td> */}
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}} onClick={()=>this.pilihOutlet(outlet.out_kode, outlet.out_nama, outlet.out_dateopen, outlet.out_kodeArea)}>OK</Button> 
                </td>
            </tr>
        });

        const currentResult5 = this.state.result5;
        const renderSupplier = currentResult5 && currentResult5.map((supplier) => {
            return <tr>
                <th scope="row" className="align-middle">{supplier.sup_kode}</th>
                <td scope="row" className="align-middle">{supplier.sup_nama}</td>
                <td className="align-middle" style={{display: this.state.show_detail_supp}}>
                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>Brand ID</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{supplier.brand_kode}</tr>
                        </td>
                    </Table>

                    <Table> 
                        <td style={{borderStyle: "none", padding: "0"}} width="50%">
                            <tr>Brand Nama</tr>
                        </td>
                        <td style={{borderStyle: "none", padding: "0"}}>
                            <tr>{supplier.brand_nama}</tr>
                        </td>
                    </Table>
                </td>
                <td className="align-middle">
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}} onClick={() => this.pilihSupplier(supplier.sup_kode, supplier.sup_nama, supplier.brand_kode, supplier.brand_nama)}>OK</Button> 
                </td>
            </tr>
        });

        const currentResult6 = this.state.result6;
        const renderBrand = currentResult6 && currentResult6.map((brand) => {
            return <tr>
                <th scope="row">{brand.brand_kode}</th>
                <td scope="row">{brand.brand_nama}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "orange", border:"none"}} onClick={()=> this.pilihBrand(brand.brand_kode, brand.brand_nama)}>OK</Button> 
                </td>
            </tr>
        });
        
        const currentResultTemporary = this.state.result_temporary;
        const renderTemporary = currentResultTemporary && currentResultTemporary.map((outlet) => {
            return <tr>
                <th scope="row">{outlet.out_code}</th>
                <td>{outlet.out_name}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "#f02c0a", border:"none"}}onClick={()=>this.removeTemporary(outlet.out_code)}>Hapus</Button> 
                </td>
                <td></td>
            </tr>
        });

        const currentResultInfo = this.state.result_temporary_info;
        const renderInfoDetail = currentResultInfo && currentResultInfo.map((brand) => {
            return <tr>
                <th scope="row">{brand.brand_code}</th>
                <td scope="row">{brand.brand_name}</td>
            </tr>
        });

        const currentResultDetailSuratIN = this.state.result_temporary_detail_surat;
        const renderDetailSuratIN = currentResultDetailSuratIN && currentResultDetailSuratIN.map((surat) => {
            return <tr>
                <th scope="row">{surat.out_code}</th>
                <td scope="row">{surat.out_name}</td>
                <td scope="row">{surat.no_doc_in}</td>
            </tr>
        });
        

        const currentResultTemporaryPrint = this.state.result_temporary_print;
        const renderTemporaryPrint = currentResultTemporaryPrint && currentResultTemporaryPrint.map((print) => {
            return <tr>
                <th scope="row">{print.data_print_id}</th>
                <td>{print.data_print_name}</td>
                <td>
                    <Button color="secondary" size="sm" style={{marginTop:'7px',marginRight:'5px', background: "#f02c0a", border:"none"}}onClick={()=>this.removeTemporaryPrint(print.data_print_id)}>Hapus</Button> 
                </td>
                <td></td>
            </tr>
        });

        return (
            <Page
                title="Product Counter"
                breadcrumbs={[{ name: 'ProductCounter', active: true }]}
                className="ProductCounter">
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <NotificationSystem
                                dismissible={false}
                                ref={notificationSystem =>
                                    (this.notificationSystem = notificationSystem)
                                }
                                style={NOTIFICATION_SYSTEM_STYLE}
                            />
                            <CardHeader className="d-flex justify-content-between">
                                <Table>
                                    <tr>
                                        <td style={{borderStyle: "none", padding: "0px", width: "10%"}} class="align-middle">
                                            <Label style={{borderStyle: 'none', marginBottom: "0px", fontWeight: "bold"}}>Brand</Label>
                                        </td>
                                        <td style={{borderStyle: "none", width: "15%"}}>
                                            <Input
                                                type = "brand_id"
                                                name = "brand_id"
                                                placeholder="Brand ID"
                                                value = {this.state.brand_id}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                        <td style={{borderStyle: "none", width: "30%"}}>
                                            <Input
                                                type = "brand_name"
                                                name = "brand_name"
                                                placeholder="Brand Nama"
                                                value = {this.state.brand_name}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{borderStyle: "none", padding: "0px", width: "10%"}} class="align-middle">
                                            <Label style={{borderStyle: 'none', marginBottom: "0px", fontWeight: "bold"}}>Supplier</Label>
                                        </td>
                                        <td style={{borderStyle: "none", width: "15%"}}>
                                            <Input
                                                type = "supplier_id"
                                                name = "supplier_id"
                                                placeholder="Supplier ID"
                                                value = {this.state.supplier_id}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                        <td style={{borderStyle: "none", width: "30%"}}>
                                            <Input
                                                type = "supplier_name"
                                                name = "supplier_name"
                                                placeholder="Supplier Nama"
                                                value = {this.state.supplier_name}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                            />
                                        </td>
                                    </tr>
                                </Table>
                                <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em", marginTop: "12px", marginBottom: "26px"}} 
                                    onClick={() => {this.setState({modal_supplier_and_brand: true, supplier_and_brandType: 'search', keyword_supplier_brand: "", filter_produk: "Show_All",  statusDisableSearch: true}); this.getListSupplierBrand();}}>Cari <MdSearch/></Button>
                            <Modal
                                isOpen={this.state.modal_nested_parent}
                                toggle={this.toggle('nested_parent')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('nested_parent')}>
                                    Tambah Product Counter
                                </ModalHeader>
                                <ModalBody>
                                    <Table>
                                        <td style={{width: "90%", padding: "none"}}>
                                            <tr>
                                                <td style={{borderStyle: "none", padding: "0px", width: "5%"}} class="align-middle">
                                                    <Label style={{borderStyle: 'none', marginBottom: "0px"}}>Brand</Label>
                                                </td>
                                                <td style={{borderStyle: "none", width: "20%", paddingLeft: "0px", paddingRight: "5px"}}>
                                                    <Input
                                                        name = "brand_id"
                                                        placeholder="Brand ID"
                                                        value = {this.state.brand_id_add}
                                                        onKeyPress={(e) => this.enterPressed(e)}
                                                    />
                                                </td>
                                                <td style={{borderStyle: "none", width: "35%", paddingLeft: "0px", paddingRight: "0px"}}>
                                                    <Input
                                                        type = "brand_name"
                                                        name = "brand_name"
                                                        placeholder="Brand Nama"
                                                        value = {this.state.brand_name_add}
                                                        onKeyPress={(e) => this.enterPressed(e)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{borderStyle: "none", padding: "0px", width: "5%"}} class="align-middle">
                                                    <Label style={{borderStyle: 'none', marginBottom: "0px"}}>Supplier</Label>
                                                </td>
                                                <td style={{borderStyle: "none", width: "20%", paddingLeft: "0px", paddingRight: "5px"}}>
                                                    <Input
                                                        type = "supplier_id"
                                                        name = "supplier_id"
                                                        placeholder="Supplier ID"
                                                        value = {this.state.supplier_id_add}
                                                        onKeyPress={(e) => this.enterPressed(e)}
                                                    />
                                                </td>
                                                <td style={{borderStyle: "none", width: "35%", paddingLeft: "0px", paddingRight: "0px"}}>
                                                    <Input
                                                        type = "supplier_name"
                                                        name = "supplier_name"
                                                        placeholder="Supplier Nama"
                                                        value = {this.state.supplier_name_add}
                                                        onKeyPress={(e) => this.enterPressed(e)}
                                                    />
                                                </td>
                                            </tr>
                                        </td>
                                        <td style={{width: "20%", padding: "0px"}}>
                                            <Button style={{background: '#4db6ac', borderStyle: 'none', width:"3em", marginTop: "24px", height: "100px", paddingLeft: "8px"}}
                                                onClick={() => {this.setState({modal_supplier_and_brand: true, supplier_and_brandType: 'add', keyword_supplier_brand: "", filter_produk: "Show_All",  statusDisableSearch: true}); this.getListSupplierBrand();}}>Cari<MdSearch/></Button>
                                        </td>
                                    </Table>

                                    <div style={{borderStyle: "none", marginTop: "10px"}}>
                                        <Table>
                                            <tr>
                                                <td style={{borderStyle: "none", width: "10%"}}>
                                                    <Label style={{borderStyle: 'none', marginBottom: "0px"}}>Outlet</Label>
                                                </td>
                                                <td style={{borderStyle: "none", width: "10%"}}>
                                                    <Button size="sm" style={{background:"#f57c00", border:"none"}} onClick={() => this.openTambahOutlet()}> . . . </Button>
                                                </td>
                                                <td style={{borderStyle: "none", width: "40%"}}>
                                                    <Label style={{
                                                        marginTop:'2%', 
                                                        marginRight: '2%', 
                                                        float: "left",
                                                        fontSize: "14px",
                                                        fontStyle: "italic"}}>(bisa pilih banyak data)</Label> 
                                                </td>
                                            </tr>
                                        </Table>
                                    </div>

                                    <div style={{overflowY: "auto", height: "250px"}}> 
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Kode Outlet</th>
                                                    <th>Nama Outlet</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTemporary}
                                            </tbody>
                                        </Table>
                                    </div>

                                    <Table>
                                        <tr>
                                            <td width="30%" style={{borderStyle: "none"}}>
                                                <Label>Tanggal Dalam Kota</Label>
                                            </td>
                                            <td width="30%" style={{borderStyle: "none"}}>
                                                <Input
                                                    type = "date"
                                                    name = "tanggal_dalam_kota"
                                                    placeholder="Tanggal Dalam Kota"
                                                    disabled = {this.state.tanggalDalamDisable}
                                                    onChange = {(event) => this.setTanggalDalam(event)}/>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td width="30%" style={{borderStyle: "none"}}>
                                                <Label>Tanggal Luar Kota</Label>
                                            </td>
                                            <td width="30%" style={{borderStyle: "none"}}>
                                                <Input
                                                    type = "date"
                                                    name = "tanggal_luar_kota"
                                                    placeholder="Tanggal Luar Kota"
                                                    disabled = {this.state.tanggalLuarDisable}
                                                    onChange = {(event) => this.setTanggalLuar(event)}/>
                                            </td>
                                        </tr>
                                    </Table>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => this.validatesDataInsert()}>
                                        Simpan
                                </Button>
                                    <Modal
                                        isOpen={this.state.modal_nested}
                                        toggle={this.toggle('nested')}>
                                        <ModalHeader style={{background: "#38ada7", color: "white"}}>Konfirmasi Penyimpanan</ModalHeader>
                                        <ModalBody>
                                            Apakah Anda yakin ingin menyimpan data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button 
                                                color="primary" 
                                                onClick={() => this.insertOutletCounter(this.state.brand_id_add, this.state.supplier_id_add, this.state.result_temporary)}>
                                                Ya
                                            </Button>{' '}
                                            <Button
                                                color="secondary"
                                                onClick={this.toggle('nested')}>
                                                Tidak
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                <Button color="secondary" onClick={this.canceladd}>
                                    Batal
                                </Button>
                                </ModalFooter>
                            </Modal>

                            {/* modal info brand list */}
                            <Modal
                                isOpen={this.state.modal_nested_info}
                                toggle={this.toggle('nested_info')}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}}>List Surat</ModalHeader>
                                <ModalBody>
                                    <div>REMINDER !!!</div>
                                    <p>Jangan lupa untuk menghubungi Outlet dibawah</p>
                                    <div style={{marginTop: "10px", marginBottom: "10px", overflowY: "auto", height: "250px"}}>
                                        <Table responsive>
                                            <thead>
                                                <th>Kode Outlet</th>
                                                <th>Nama Outlet</th>
                                                <th>Nomor Surat</th>
                                            </thead>
                                            <tbody>
                                                {renderDetailSuratIN}
                                            </tbody>
                                        </Table>
                                    </div>

                                    <div style={{marginTop: "10px", marginBottom: "10px"}}>
                                        <Label>Nomor Diskon : </Label>
                                        <Label style={{marginLeft: "8px"}}>{this.state.nomor_diskon}</Label>
                                    </div>

                                    <div>LIST BRAND YANG PERLU DIINPUT !!!</div> 
                                    <div style={{overflowY: "auto", height: "250px"}}>
                                        <Table responsive>
                                            <thead>
                                                <th>Brand ID</th>
                                                <th>Brand Nama</th>
                                            </thead>

                                            <tbody>
                                                {renderInfoDetail}
                                            </tbody>
                                        </Table>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button 
                                        color="primary" 
                                        onClick={() => this.closeAllModalInsert()}>
                                        Tutup
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* modal info brand list */}

                            {/* delete */}
                            <Modal
                                isOpen={this.state.modal_delete}
                                toggle={this.toggle('delete')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}}>
                                    Hapus Counter
                                </ModalHeader>
                                <ModalBody>
                                    <div style={{display: "flex"}}>
                                        <strong>Kode Outlet:</strong>
                                        <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.out_code}</Label>
                                    </div>

                                    <div style={{display: "flex"}}>
                                        <strong>Nama Outlet:</strong>
                                        <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.out_name}</Label>
                                    </div>

                                    <div style={{display: "flex"}}>
                                        <strong>Alamat:</strong>
                                        <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.address}</Label>
                                    </div>

                                    <div style={{display: "flex"}}>
                                        <strong>Suppllier ID:</strong>
                                        <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.supplier_id}</Label>
                                    </div>

                                    <div style={{display: "flex"}}>
                                        <strong>Supplier Nama:</strong>
                                        <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.supplier_name}</Label>
                                    </div>

                                    <div style={{display: "flex"}}>
                                        <strong>Brand ID:</strong>
                                        <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.brand_id}</Label>
                                    </div>

                                    <div style={{display: "flex"}}>
                                        <strong>Brand Nama:</strong>
                                        <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.brand_name}</Label>
                                    </div>

                                    <Table>
                                        <tr>
                                            <td width="30%" style={{borderStyle: "none", paddingLeft: "0px"}}>
                                                <Label>Tanggal Buka</Label>
                                            </td>
                                            <td width="30%" style={{borderStyle: "none"}}>
                                                <Input
                                                    name = "tanggal_buka"
                                                    value = {this.state.tgl_mulaioutlet}
                                                    disabled = {true}/>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td width="30%" style={{borderStyle: "none", paddingLeft: "0px"}}>
                                                <Label>Tanggal Tutup</Label>
                                            </td>
                                            <td width="30%" style={{borderStyle: "none"}}>
                                                <Input
                                                    type = "date"
                                                    name = "tanggal_tutup"
                                                    onChange = {(event) => this.setTanggalTutup(event)}/>
                                            </td>
                                        </tr>
                                    </Table>
                                </ModalBody>
                                <ModalFooter>
                                    <Modal
                                        isOpen={this.state.modal_nested_delete}
                                        toggle={this.toggle('nested_delete')}
                                        className={this.props.className}>
                                        <ModalHeader style={{background: "#38ada7", color: "white"}}>
                                            Konfirmasi Hapus Counter
                                        </ModalHeader>
                                        <ModalBody>
                                            Apakah Anda yakin ingin menghapus data ini?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary"  onClick={() => this.deleteOutletCounter(this.state.out_code, this.state.supplier_id, this.state.brand_id, this.state.activeUserId)}>
                                                Ya
                                            </Button>
                                            <Button
                                                color="secondary"
                                                onClick={this.toggle('nested_delete')}>
                                                Tidak
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                    <Button color="primary" onClick={() => this.validateDelete()}>
                                        Hapus
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('delete')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* delete */}

                            {/* modal info surat out */}
                            <Modal
                                isOpen={this.state.modal_nested_info_out}
                                toggle={this.toggle('nested_info_out')}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}}>Surat Out</ModalHeader>
                                <ModalBody>
                                    <div>REMINDER !!!</div>
                                    <p>Jangan lupa untuk menghubungi Outlet</p>
                                    <div style={{marginTop: "10px", marginBottom: "10px"}}>
                                        <Label style={{marginBottom: "0px", fontWeight: "bold"}}>Nomor Surat : </Label>
                                        <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.nomor_surat_out}</Label>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button 
                                        color="primary" 
                                        onClick={this.toggle('nested_info_out')}>
                                        Tutup
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* modal info surat out */}

                            {/* info counter */}
                            <Modal
                                isOpen={this.state.modal_info_counter}
                                toggle={this.toggle('info_counter')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('info_counter')}>
                                    Info Counter
                                </ModalHeader>
                                <ModalBody>
                                    <Row>
                                        <Col width="30%">
                                            <Label>Status</Label>
                                        </Col>
                                        <Col width="70%">
                                            <form name ="from_status_info_counter" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                                <select value={this.state.status_info_counter} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueStatusInfoCounter(evt)}>
                                                    <option value="Show_All">Semua Status</option>
                                                    <option value="masih_counter">Masih Counter</option>
                                                    <option value="putus_counter">Putus Counter</option>
                                                </select>
                                            </form>
                                        </Col>
                                    </Row>

                                    <Row style={{marginTop: "8px"}}>
                                        <Col width="30%">
                                            <Label>Info by</Label>
                                        </Col>
                                        <Col width="70%">
                                            <form name ="from_info_info_counter" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                                <select value={this.state.info_info_counter} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueInfoInfoCounter(evt)}>
                                                    <option value="Show_All">Pilih</option>
                                                    <option value="outlet_info_counter">Outlet</option>
                                                    <option value="supplier_info_counter">Supplier</option>
                                                </select>
                                            </form>
                                        </Col>
                                    </Row>

                                    <Row style={{marginTop: "8px"}}>
                                        <Col style={{display: this.state.show_outlet_info_counter, width:"30%"}}>
                                            <Label>Find Outlet</Label>
                                        </Col>
                                        <Col style={{display: this.state.show_outlet_info_counter, width:"70%"}}>
                                            <Button size="sm" style={{background:"#f57c00", border:"none"}} onClick={() => this.openOutletInfoCounter()}> . . . </Button>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col style={{display: this.state.show_supplier_info_counter, width:"30%"}}>
                                            <Label>Find Supplier</Label>
                                        </Col>
                                        <Col style={{display: this.state.show_supplier_info_counter, width:"70%"}}>
                                            <Button size="sm" style={{background:"#f57c00", border:"none"}} onClick={() => this.openSupplierInfoCounter()}> . . . </Button>
                                        </Col>
                                    </Row>

                                    <div style={{display: this.state.show_outlet_info_counter, marginTop: "8px"}}>
                                        <div>
                                            <strong>Kode Outlet:</strong>
                                            <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.info_kode_outlet}</Label>
                                        </div>

                                        <div>
                                            <strong>Nama Outlet:</strong>
                                            <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.info_nama_outlet}</Label>
                                        </div>

                                        <div>
                                            <strong>Tanggal Buka:</strong>
                                            <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.info_tanggal_buka_outlet}</Label>
                                        </div>
                                    </div>

                                    <div style={{display: this.state.show_supplier_info_counter, marginTop: "8px"}}>
                                        <div>
                                            <strong>Suppllier ID:</strong>
                                            <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.info_supplier_id}</Label>
                                        </div>

                                        <div>
                                            <strong>Supplier Nama:</strong>
                                            <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.info_supplier_nama}</Label>
                                        </div>

                                        <div>
                                            <strong>Brand ID:</strong>
                                            <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.info_brand_id}</Label>
                                        </div>

                                        <div>
                                            <strong>Brand Nama:</strong>
                                            <Label style={{marginBottom: "0px", marginLeft: "8px"}}>{this.state.info_brand_nama}</Label>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => this.viewInfoCounter()}>
                                        View
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('info_counter')}>
                                        Tutup
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* info counter */}

                            {/* surat */}
                            <Modal
                                isOpen={this.state.modal_surat}
                                toggle={this.toggle('surat')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('surat')}>
                                    Surat
                                </ModalHeader>
                                <ModalBody>
                                    <Row>
                                        <Col width="30%">
                                            <Label>No Surat</Label>
                                        </Col>
                                        <Col width="70%">
                                            <Input
                                            type="search"
                                            placeholder="Cari Nomor Surat"
                                            value = {this.state.nomor_surat}
                                            maxLength = "8"
                                            style={{marginRight:"0.2vw", paddingLeft: "15px"}}
                                            onChange={evt => this.updateSearchValueNomorSurat(evt)}/>
                                        </Col>
                                    </Row>

                                    <Row style={{marginTop: "8px"}}>
                                        <Col style={{width: "30%"}}>
                                            <Label>Jenis</Label>
                                        </Col>
                                        <Col style={{width: "70%"}}>
                                            <Label style={{width: "50%"}}>
                                                <input type="radio" value="in" checked={this.state.tipe_surat === "in"}
                                                    onChange={(evt) => this.handleTipeSurat(evt)}/>   In
                                            </Label>
                                            <Label style={{width: "50%"}}>
                                                <input type="radio" value="out" checked={this.state.tipe_surat === "out"}
                                                    onChange={(evt) =>  this.handleTipeSurat(evt)}/>   Out
                                            </Label>
                                        </Col>
                                    </Row>

                                    <Row style={{marginTop: "8px"}}>
                                        <Col style={{width: "30%"}}></Col>
                                        <Col style={{width: "70%"}}>
                                            <Label style={{display: this.state.tampil_cetak}}>
                                                <input type="checkbox" checked={this.state.cetak_produk}
                                                    onChange={() => this.handleCheck()}/>   Cetak Produk
                                            </Label>
                                        </Col>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => this.printSurat()}>
                                        Print
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('surat')}>
                                        Tutup
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* surat */}

                            {/* print */}
                            <Modal
                                isOpen={this.state.modal_print}
                                toggle={this.toggle('print')}
                                className={this.props.className}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('print')}>
                                    Print
                                </ModalHeader>
                                <ModalBody>
                                    <Row>
                                        <Col width="30%">
                                            <Label className="align-middle">Order by</Label>
                                        </Col>
                                        <Col width="70%">
                                            <form name ="from_status_info_counter" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                                <select value={this.state.orderby_print} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueOrderByPrint(evt)}>
                                                    <option value="choose">Pilih</option>
                                                    <option value="Outlet">Outlet</option>
                                                    <option value="Supplier">Supplier</option>
                                                    <option value="Brand">Brand</option>
                                                </select>
                                            </form>
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop: "8px", marginBottom: "10px"}}>
                                        <Col width="30%" style={{display: this.state.display_print}}>
                                            <Label>{this.state.orderby_print}</Label>
                                        </Col>
                                        <Col  width="70%" style={{display: this.state.display_print}}>
                                            <Button size="sm" style={{background:"#f57c00", border:"none"}}onClick={() => this.openPrintOrder()}> . . . </Button>
                                        </Col>
                                    </Row>

                                    <div style={{overflowY: "auto", height: "350px", display: this.state.display_print}}> 
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>{this.state.jenis_print_id}</th>
                                                    <th>{this.state.jenis_print_nama}</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTemporaryPrint}
                                            </tbody>
                                        </Table>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => this.printPrint()}>
                                        Print
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('print')}>
                                        Tutup
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* print */}

                            {/* get supplier and brand*/}
                            <Modal
                                isOpen={this.state.modal_supplier_and_brand} 
                                toggle={this.toggle('supplier_and_brand')}
                                className={this.props.className}
                                visible={this.state.supplier_and_brand}
                                onRequestClose={()=>{this.state.modal_supplier=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('supplier_and_brand')}>
                                    Lihat Produk Supplier dan Brand
                                </ModalHeader>
                                <ModalBody>
                                    <CardHeader className="d-flex justify-content-between">
                                        <form name ="form_tampil_supplier_brand" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                            <select value={this.state.filter_produk} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueProductFilter(evt)}>
                                                <option value="Show_All">Pilih</option>
                                                <option value="product_code">Kode Prod</option>
                                                <option value="product_name">Nama Prod</option>
                                                <option value="brand_name">Brand</option>
                                                <option value="supplier_name">Supplier</option>
                                            </select>
                                        </form>
                                        <Input
                                            type="search"
                                            className="cr-search-form__input"
                                            placeholder="Cari produk"
                                            value = {this.state.keyword_supplier_brand}
                                            style={{marginRight:"0.2vw"}}
                                            disabled = {this.state.statusDisableSearch}
                                            onChange={evt => this.updateSearchValueSupplierBrand(evt)}
                                            onKeyPress={(e) => this.enterPressedSupplierBrand(e)}
                                            
                                        />
                                        <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center', alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={this.sendSearchParamSupplierBrand()}><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody style={{padding: "0px"}}>
                                        <div style={{overflowY: "auto", height: "400px"}}>
                                            <Table responsive>
                                                <thead>
                                                    <th className="align-middle" style={{paddingLeft: "0px", paddingRight: "0px"}}>Kode Produk</th>
                                                    <th className="align-middle" style={{paddingLeft: "0px", paddingRight: "0px"}}>Nama Produk</th>
                                                    <th className="align-middle" style={{paddingLeft: "0px", paddingRight: "0px"}}>Detail</th>
                                                    <th className="align-middle" style={{paddingLeft: "0px", paddingRight: "0px"}}>Pilih</th>
                                                </thead>
                                                <tbody style={{display: this.state.table_display3}}>
                                                    {renderSupplierBrand}
                                                </tbody>
                                            </Table>      
                                            <p className = "text-center" style={{display: this.state.notFound3}}>Data Tidak Ditemukan</p>       
                                        </div>
                                    </CardBody>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('supplier_and_brand')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get supplier and brand */}

                            {/* get outlet */}
                            <Modal
                                isOpen={this.state.modal_outlet} 
                                toggle={this.toggle('outlet')}
                                className={this.props.className}
                                visible={this.state.outlet}
                                onRequestClose={()=>{this.state.modal_outlet=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('outlet')}>
                                    Lihat Outlet
                                </ModalHeader>
                                <ModalBody>
                                    <CardHeader className="d-flex justify-content-between">
                                        <form name ="form_outlet" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                            <select disabled={this.state.disableOutletDropdown} value={this.state.filter_outlet} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueOutlet(evt)}>
                                                <option value="Show_All">Pilih</option>
                                                <option value="outlet_code">Kode</option>
                                                <option value="outlet_name">Nama</option>
                                            </select>
                                        </form>

                                        <Input
                                            type="search"
                                            className="cr-search-form__input"
                                            placeholder= {this.state.outlet_search_placeholder}
                                            value = {this.state.keyword_outlet}
                                            style={{marginRight:"0.2vw"}}
                                            disabled={this.state.disableOutletSearch}
                                            onChange={evt => this.updateSearchValueOutlet(evt)}
                                            onKeyPress={(e) => this.enterSearchPressedOutlet(e)}
                                        />
                                        <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={()=>this.sendSearchOutletParams()}><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody>
                                        <div style={{overflowY: "auto", height: "400px"}}>
                                            <Table responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Kode Outlet</th>
                                                        <th>Nama Outlet</th>
                                                        {/* <th>Alamat</th> */}
                                                        <th>Pilih</th>
                                                    </tr>
                                                </thead>
                                                <tbody  style={{display: this.state.table_display4}}>
                                                    {renderOutletModal}
                                                </tbody>
                                            </Table>
                                            <p className = "text-center" style={{display: this.state.notFound4}}>Data Tidak Ditemukan</p> 
                                        </div>
                                    </CardBody>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('outlet')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get outlet */}

                            {/* get supplier */}
                            <Modal
                                isOpen={this.state.modal_supplier} 
                                toggle={this.toggle('supplier')}
                                className={this.props.className}
                                visible={this.state.supplier}
                                onRequestClose={()=>{this.state.modal_supplier=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}} toggle={this.toggle('supplier')}>
                                    Lihat Supplier
                                </ModalHeader>
                                <ModalBody>
                                    <CardHeader className="d-flex justify-content-between">
                                        <form name ="form_outlet" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                            <select disabled={this.state.disableSupplierDropdown} value={this.state.filter_supplier} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueSupplier(evt)}>
                                                <option value="Show_All">Pilih</option>
                                                <option value="supplier_code">ID</option>
                                                <option value="supplier_name">Nama</option>
                                            </select>
                                        </form>

                                        <Input
                                            type="search"
                                            className="cr-search-form__input"
                                            placeholder = {this.state.supplier_search_placeholder}
                                            value = {this.state.keyword_supplier}
                                            style={{marginRight:"0.2vw"}}
                                            disabled = {this.state.disableSupplierSearch}
                                            onChange={evt => this.updateSearchValueSupplier(evt)}
                                            onKeyPress={(e) => this.enterSearchPressedSupplier(e)}
                                        />
                                        <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={()=>this.sendSearchSupplierParams()}><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody>
                                        <div style={{overflowY: "auto", height: "400px"}}>
                                            <Table responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Supplier ID</th>
                                                        <th>Supplier Nama</th>
                                                        <th style={{display: this.state.show_detail_supp}}>Detail</th>
                                                        <th>Pilih</th>
                                                    </tr>
                                                </thead>
                                                <tbody  style={{display: this.state.table_display5}}>
                                                    {renderSupplier}
                                                </tbody>
                                            </Table>
                                            <p className = "text-center" style={{display: this.state.notFound5}}>Data Tidak Ditemukan</p>
                                        </div>
                                    </CardBody>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('supplier')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get supplier */}

                            {/* get brand */}
                            <Modal
                                isOpen={this.state.modal_brand} 
                                toggle={this.toggle('brand')}
                                className={this.props.className}
                                visible={this.state.supplier}
                                onRequestClose={()=>{this.state.modal_supplier=false}}>
                                <ModalHeader style={{background: "#38ada7", color: "white"}}>
                                    Lihat Brand
                                </ModalHeader>
                                <ModalBody>
                                    <CardHeader className="d-flex justify-content-between">
                                        <form name ="form_outlet" style={{paddingTop:"10", marginRight:"0.2vw"}}>
                                            <select disabled={this.state.disableBrandDropdown} value={this.state.filter_brand} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueBrand(evt)}>
                                                <option value="Show_All">Pilih</option>
                                                <option value="brand_code">ID</option>
                                                <option value="brand_name">Nama</option>
                                            </select>
                                        </form>

                                        <Input
                                            type="search"
                                            className="cr-search-form__input"
                                            placeholder = {this.state.brand_search_placeholder}
                                            value = {this.state.keyword_brand}
                                            style={{marginRight:"0.2vw"}}
                                            disabled = {this.state.disableBrandSearch}
                                            onChange={evt => this.updateSearchValueBrand(evt)}
                                            onKeyPress={(e) => this.enterSearchPressedBrand(e)}
                                        />
                                        <Button size="sm" style={{background: '#4db6ac', borderStyle: 'none', justifyContent:'center',alignItems:'center', marginRight: "0.2vw", width:"4em"}} onClick={()=>this.sendSearchBrandParams()}><MdSearch/></Button>
                                    </CardHeader>
                                    <CardBody>
                                        <div style={{overflowY: "auto", height: "400px"}}>
                                            <Table responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Brand ID</th>
                                                        <th>Brand Nama</th>
                                                        <th>Pilih</th>
                                                    </tr>
                                                </thead>
                                                <tbody  style={{display: this.state.table_display6}}>
                                                    {renderBrand}
                                                </tbody>
                                            </Table>
                                            <p className = "text-center" style={{display: this.state.notFound6}}>Data Tidak Ditemukan</p>
                                        </div>
                                    </CardBody>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle('brand')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* get supplier */}
                            </CardHeader>

                            <div>
                                <Button size="sm" style={{
                                    width: "17%",
                                    marginTop:'2%', 
                                    marginRight: '2%', 
                                    background:"#f57c00", 
                                    border:"none",
                                    float: "right"}}
                                onClick={this.toggle('nested_parent')}>Tambah</Button>

                                <Button size="sm" style={{
                                    width: "15%",
                                    marginTop:'2%', 
                                    marginRight: '2%', 
                                    background:"#f57c00", 
                                    border:"none",
                                    float: "right"}}
                                onClick={this.toggle('print')}>Print</Button>

                                <Button size="sm" style={{
                                    width: "15%",
                                    marginTop:'2%', 
                                    marginRight: '2%', 
                                    background:"#f57c00", 
                                    border:"none",
                                    float: "right"}}
                                onClick={this.toggle('surat')}>Surat</Button>

                                <Button size="sm" style={{
                                    width: "20%",
                                    marginTop:'2%', 
                                    marginRight: '2%', 
                                    background:"#f57c00", 
                                    border:"none",
                                    float: "right"}}
                                onClick={() => this.infoNewProduk()}>Info Produk Baru</Button>

                                <Button size="sm" style={{
                                    width: "20%",
                                    marginTop:'2%', 
                                    marginRight: '2%', 
                                    background:"#f57c00", 
                                    border:"none",
                                    float: "right"}}
                                onClick={this.toggle('info_counter')}>Info Counter</Button>
                            </div>
                            <div style={{marginTop: "10px"}}> 
                                <Label style={{float: "left", marginTop:'2.3%', width: "120px", marginBottom: "14px", justifyContent: "center", alignItems: "center", marginLeft: "10px"}}>Filter Counter</Label>
                                <form name ="form_filter_counter" style={{marginTop:'1.5%', border:"none", float: "left"}}>
                                    <select value={this.state.filter_counter} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueFilterByCounter(evt)}>
                                    <option value="masih_counter">Masih Counter</option>
                                    <option value="tidak_counter">Tidak Counter</option>
                                    </select>
                                </form>

                                <Label style={{float: "left", marginTop:'2.3%', width: "90px", marginBottom: "14px", justifyContent: "center", alignItems: "center", marginLeft: "10px"}}>Filter Area</Label>
                                <form name ="form_filter_area" style={{marginTop:'1.5%', border:"none", float: "left"}}>
                                    <select value={this.state.filter_area} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueFilterByArea(evt)}>
                                    <option value="Show_All">Semua</option>
                                    <option value="dalam_kota">Jabodetabek</option>
                                    <option value="luar_kota">Luar Kota</option>
                                    </select>
                                </form>
                            </div>

                            <div>
                                <Label style={{float: "left", marginTop:'2.3%', width: "120px", marginBottom: "14px", justifyContent: "center", alignItems: "center", marginLeft: "10px"}}>Sort By</Label>
                                <form name ="form_sort_outlet" style={{marginTop:'1.5%', border:"none", float: "left"}}>
                                    <select value={this.state.sort_outlet} name="filtermenu" class="dropdown-toggle btn btn-primary" style={{background: '#4db6ac', borderStyle: 'none'}} onChange={evt => this.updateSelectionValueSortOutlet(evt)}>
                                    <option value="out_code">Kode Outlet (ASC)</option>
                                    <option value="out_nama">Nama Outlet (ASC)</option>
                                    <option value="out_area">Kode Area (ASC)</option>
                                    </select>
                                </form>
                            </div>

                            <div>
                                <Label style={{float: "right", marginRight: "15px", marginBottom: "0"}}>Jumlah Outlet: {this.state.jumlah_outlet}</Label>
                            </div>
                            <CardBody style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                <div style={{overflowY: "auto", height: "400px"}}>
                                    <Table responsive>
                                        <thead style={{borderCollapse: "collapse"}}>
                                            <tr>
                                                <th style={{borderLeft: "2px solid #dee2e6"}}>Kode Outlet</th>
                                                <th style={{borderLeft: "2px solid #dee2e6"}}>Nama Outlet</th>
                                                <th style={{borderLeft: "2px solid #dee2e6"}}>Alamat</th>
                                                <th style={{borderLeft: "2px solid #dee2e6"}}>Kode Area</th>
                                                <th style={{display: this.state.action, borderLeft: "2px solid #dee2e6", borderRight: "2px solid #dee2e6"}}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{display: this.state.table_display}}>
                                            {renderOutlet}
                                        </tbody>
                                    </Table>
                                </div>
                                <p className = "text-center" style={{display: this.state.notFound}}>Data Tidak Ditemukan</p>
                                <div style={{marginTop: "40px", display: "inline-block", width: "100%"}}>
                                    <p style={{float: "left"}}>List Produk Outlet {this.state.outlet_produk}</p>
                                    <Label style={{float: "right", marginBottom: "0", marginRight: "15px"}}>Jumlah Produk: {this.state.jumlah_produk}</Label>
                                </div>
                                <div style={{overflowY: "auto", height: "400px"}}>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th style={{borderLeft: "2px solid #dee2e6"}}>Kode Produk</th>
                                                <th style={{borderLeft: "2px solid #dee2e6"}}>Nama Produk</th>
                                                <th style={{borderLeft: "2px solid #dee2e6", borderRight: "2px solid #dee2e6"}}>Tanggal Mulai</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{display: this.state.table_display2}}>
                                            {renderProduk}
                                        </tbody>
                                    </Table>
                                    <p className = "text-center" style={{display: this.state.notFound2}}>Data Tidak Ditemukan</p> 
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }
}
export default ProductCounter;