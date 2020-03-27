import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';

import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label,InputGroup,InputGroupAddon,Form
} from 'reactstrap';
import { MdSearch, MdLoyalty, MdFormatAlignRight} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import DropdownPage from '../template/DropdownPage';


const hostUrl = 'https://api.docnet.id/CHCMasterH/MasterJenisArea'

class JenisArea extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            result: [],
            isLoading: false,
            inputtedNameInsert: "",
            inputtedKodeInsert: "",
            inputtedKodeAreaUpdate: "",
            inputtedNamaAreaUpdate: "",
            inputtedCheckboxAreaClassA:"N",  
            inputtedCheckboxAreaClassC:"N",
            inputtedCheckboxAreaClassG:"N",
            inputtedCheckboxAreaClassS:"N",
            checkboxValueClassA: false,
            checkboxValueClassC: false,
            checkboxValueClassG: false,
            checkboxValueClassS: false,
            searchInputtedName :"",
            currentPage: 0,
            todosPerPage: 5,
            flag:0,
            totalPage :'',
            hidePagination: 'flex-row',
        
        };
        this.onCheckChange = this.onCheckChange.bind(this)
    }
//fungsi notification
    showNotification= (currMessage)=>{
        setTimeout(() => {
            if (!this.notificationSystem) {
              return;
            }
            this.notificationSystem.addNotification({
              title: <MdLoyalty/>,
              message:
                currMessage,
              level: 'info',
            });
        }, 100);
    }

// ----------------------------------------------- PAGINATION SHOW ALL DATA --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRIS

//Memberikan semua list data pada page tersebut dimana diBack end mempunyai data Current limit maupun Current Page
    getListbyPaging(currPage,currLimit)
    {
        var url = hostUrl+`/TampilSemuaDataJenisArea/page?size=${currLimit}&page=${currPage}`;
        this.isLoading = true;
        fetch(url)
        .then(response => response.json())
        .then(data => this.setState({ result: data.content, isLoading: false, totalPage: data.totalPages}));
        console.log("Total Pages: " + this.state.totalPage);
    }

//fungsi untuk mengambil semua data dimana memanggil current page dan perpage
    componentDidMount() {
        this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
    }


    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value },() =>{
       
            this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
        });
    }


    handleWrite(event,flag) {
        if(this.state.currentPage + flag < 0 || this.state.currentPage + flag > this.state.totalPage - 1)
        {
            return;
        }
        this.setState({
        currentPage: Number(event.target.value) + flag
                },() =>{
            if(flag!==0)
            {
                this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
            }
        });
    }

//fungsi yang mengarah kan ke arah first page 
    handleFirst(event) {
        this.setState({
            currentPage: 0
        });
        this.getListbyPaging(0, this.state.todosPerPage);
    }
     
//fungsi yang mengarah ke arah last page 
    handleLast(event) {
        this.setState({
            currentPage : this.state.totalPage -1
        });
        this.getListbyPaging(this.state.totalPage -1, this.state.todosPerPage);
    }

//state awal pada saat membuka suatu page tsb nanti dicari langsung di render() 
    state = {
        modal              : false,
        modal_backdrop     : false,
        modal_nested_parent: false,
        modal_nested       : false,
        modal_delete       : false,
        modal_update       : false,
        backdrop           : true
    };

//fungsi untuk membuka suatu toggle di page tsb
    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

//pembuatan setState disemua function, dimana hanya memanggil nama nya saja ex modal_delete , maka di render hanya panggil delete saja 
        this.setState({
            [`modal_${modalType}`]: !this.state [`modal_${modalType}`]
        });
    };

// --------------------------------------------------------- INSERT --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS


//melakukan insert data dimana melempar parameter ke backend
insertMasterJenisArea =  () => async  () => {
    var url     = hostUrl+`/TambahJenisArea`;

    this.setState({isLoading : true}); 
    console.log("updateY"+this.state.inputtedCheckboxAreaClassA,this.state.inputtedCheckboxAreaClassC,this.state.inputtedCheckboxAreaClassG,this.state.inputtedCheckboxAreaClassS)
           
    var payload = {
        jnsarea_name  :this.state.inputtedNameInsert,
        jnsarea_code  :this.state.inputtedKodeInsert,
        jnsarea_classa:this.state.inputtedCheckboxAreaClassA,
        jnsarea_classc:this.state.inputtedCheckboxAreaClassC,
        jnsarea_classg:this.state.inputtedCheckboxAreaClassG,
        jnsarea_classs:this.state.inputtedCheckboxAreaClassS,
        jnsarea_userid: "0"

        
    };

    console.log(JSON.stringify(payload));

    let data = await fetch(url,{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        json: true,
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            this.state.modal_nested        = false;
            this.state.modal_nested_parent = false;
            this.componentDidMount();
            this.setState({
                inputtedCheckboxAreaClassA      : "N",
                inputtedCheckboxAreaClassC      :"N",
                inputtedCheckboxAreaClassG      : "N",
                inputtedCheckboxAreaClassS      :"N"
            })
            return response.json();
        }
        
        else {
            console.log("response failed!");
        }
    })
    if(data){
        this.showNotification("Data "+this.state.inputtedNameInsert+" Berhasil Disimpan");
      
    }
    else{
        alert("Data "+this.state.inputtedNameInsert+" Sudah Pernah Ada");
    }
}

//Insert state awal nya dimana tidak boleh special character dan harus semua huruf besar
insertKodeInputValue = (evt) => {
    this.setState({
        inputtedKodeInsert: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
    });
}
insertNamaInputValue= (evt) => {
    this.setState({
        inputtedNameInsert: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
    });
}





// onCheckChange(e){
//         this.setState({
//             [e.target.name]: e.target.value
  
//          })
//     console.log(e.target.value);
// }
onCheckChange(e){

    if(e.target.checked === true){
        this.setState({
            ["inputtedCheckboxAreaClass" + e.target.name]: e.target.value.replace(e.target.value, "Y"),
            ["checkboxValueClass" + e.target.name] : true
        })
    }
    else{
        this.setState({
            ["inputtedCheckboxAreaClass" + e.target.name]: e.target.value.replace(e.target.value, "N"),
            ["checkboxValueClass" + e.target.name] : false
        })
    }
}


// Untuk reset nama
handleClose= ()=>{
    this.setState({
        inputtedKodeInsert :'',
        inputtedNameInsert :'',
        inputtedCheckboxAreaClassA:"N",  
        inputtedCheckboxAreaClassC:"N",
        inputtedCheckboxAreaClassG:"N",
        inputtedCheckboxAreaClassS:"N",
    });
}

// --------------------------------------------------------- UPDATE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

//pada saat melakukan edit yang akan di lempar ke backend adalah first_param = nama yang telah di edit, second_param adalah yang didapatkan 
    setEditJenisArea =  (first_param, second_param,third_param) => async  () => {
        this.setState({isLoading : true});
        var url = hostUrl+`/UbahJenisArea/${first_param}`;
      
        var payload = {
            jnsarea_name  :second_param,
            jnsarea_code  :third_param,
            jnsarea_classa:this.state.inputtedCheckboxAreaClassA,
            jnsarea_classc:this.state.inputtedCheckboxAreaClassC,
            jnsarea_classg:this.state.inputtedCheckboxAreaClassG,
            jnsarea_classs:this.state.inputtedCheckboxAreaClassS,
            jns_userid: "0"
        };

        let data = await fetch(url,{
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            json: true,
            body: JSON.stringify(payload)
        })
        //2.Ketika sudah terespond oleh backend , maka kita akan melakukan hal ini
            .then(response =>{
                if(response.ok){
                    //state ini diawal dibuat false 
                    this.state.modal_update = false;
                    this.state.modal_nested = false;
                    this.state.backdrop     = false;
                  
                    this.componentDidMount();
                    return response.json();
                }
            })
            if(data){
                this.showNotification("Data Berhasil di Ubah Menjadi "+second_param+"");
                this.isLoading = true;
                this.setState({
                    inputtedCheckboxAreaClassA : "N",
                    inputtedCheckboxAreaClassC: "N",
                     inputtedCheckboxAreaClassG: "N",
                     inputtedCheckboxAreaClassS: "N"
                 });
            }
            else{
                alert("Data yang Diubah sama !");
            }
    }
    boolean = false;

//ketika melakukan update, input an yang masuk harus uppercase dan tidak boleh special character
updateInputValueNama= (evt) => {
    this.setState({
        inputtedNamaAreaUpdate: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase(),  
    });
}
updateInputValueKode= (evt) => {
    this.setState({
    
        inputtedKodeAreaUpdate: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
    });
}

//(first_param,second_param,third_param)
updateModalWithItemID (
        idUpdateJenisArea, 
        namaUpdateJenisArea,
        kodeUpdateJenisArea,
        inputtedCheckboxAreaClassA,
        inputtedCheckboxAreaClassC,
        inputtedCheckboxAreaClassG,
        inputtedCheckboxAreaClassS
        ){
           
            this.state.activeItem_Id2 = idUpdateJenisArea;
            this.state.inputtedNamaAreaUpdate = namaUpdateJenisArea;
            this.state.inputtedKodeAreaUpdate = kodeUpdateJenisArea;
            this.state.inputtedCheckboxAreaClassA = inputtedCheckboxAreaClassA;
            this.state.inputtedCheckboxAreaClassC = inputtedCheckboxAreaClassC;
            this.state.inputtedCheckboxAreaClassG = inputtedCheckboxAreaClassG;
            this.state.inputtedCheckboxAreaClassS = inputtedCheckboxAreaClassS;
            if(this.state.inputtedCheckboxAreaClassA === 'Y'){
               
                this.state.checkboxValueClassA = true;
            }
            else{
                // this.setState({
                //     checkboxValueClassA : false
                // })
                this.state.checkboxValueClassA = false;
            }  
            if(this.state.inputtedCheckboxAreaClassC === 'Y'){
                // this.setState({
                //     checkboxValueClassC : true
                // })
                this.state.checkboxValueClassC = true;
            }
            else{
                // this.setState({
                //     checkboxValueClassC : false
                // })
                this.state.checkboxValueClassC = false;
            }  
            if(this.state.inputtedCheckboxAreaClassG === 'Y'){
                // this.setState({
                //     checkboxValueClassG : true
                // })
                this.state.checkboxValueClassG = true;
            }
            else{
                // this.setState({
                //     checkboxValueClassG : false
                // })
                this.state.checkboxValueClassG = false;
            }  
            if(this.state.inputtedCheckboxAreaClassS === 'Y'){
                // this.setState({
                //     checkboxValueClassS : true
                // })
                this.state.checkboxValueClassS = true;
            } 
            else{
                // this.setState({
                //     checkboxValueClassS : false
                // })
                this.state.checkboxValueClassS = false;
            }
            this.setState({
                modal_update :true
            });
            console.log(this.state.checkboxValueClassA,this.state.checkboxValueClassC,this.state.checkboxValueClassG,this.state.checkboxValueClassS);
    }


// --------------------------------------------------------- SEARCH --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

//mengambil parameter yang telah diinput di searchInputtedName . lalu dilempar ke Backend
searchInputValue = ()  =>{
    //mengambil data dari backend
    if(this.state.searchInputtedName.length !==  0){
        this.setState({isLoading : true});
        var url = hostUrl+`/CariJenisArea/${this.state.searchInputtedName}`;
        fetch(url)
        .then(response   => response.json())
        .then(data => this.setState({ result: data, isLoading: false }));
        //pada saat melakukan search, pagination yang dibawah di matikan sehingga tidak ada pagination
        //d-none itu display none cari di documentation bootstrap
        this.state.hidePagination = 'd-none';
    }
    else {
        //apabila tidak melakukan search, pagination nya tidak dihilangkan 
        //flex-row itu class name 
        this.componentDidMount();
        this.isLoading = false;
        this.state.hidePagination = 'flex-row';
    }
}

//function untuk melakukan search pada saat menekan enter
enterPressed = (event,search) =>{
    var code = event.keyCode || event.which;
    if(code === 13) { //13 is the enter keycode
        //Do stuff in here
        event.preventDefault();
        if(search===true)
        {
            this.setState({currentPage: 0}
                ,() =>{this.searchInputValue(this.state.currentPage,this.state.searchInputtedName);});
        }
        else{
            this.componentDidMount();
        }
    } 
}

//ketika melakukan search, state input-an yang masuk harus uppercase dan tidak boleh special character
setSearchInputState = (evt) => {
    this.setState({
        searchInputtedName: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
    })
}
 
//--------------------------------------------------------- DELETE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

// 1.Pelemparan parameter ke Backend dimana data apa saja yang akan di hapus
deleteJenisArea = (param) => async ()=>{

    var url = `http://10.0.111.143:8083/HapusJenisArea/${param}`;
    var payload = { 
        jnsarea_userid: "0"
    };
    let data = await fetch(url,{
        method : 'PUT',
        body   : JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
})

//2.Ketika sudah terespond oleh backend , maka frontend akan melakukan hal ini
        .then(response => {

            if (response.ok) {
                this.state.modal_delete = false;
                this.state.modal_nested = false;
                this.state.backdrop     = false;
                this.componentDidMount();
                return response.json();
            }
        });

        if(data){
          this.showNotification("Data Berhasil di Hapus");
        }
}

// set awal pada saat membuka delete
    openModalWithItemID(idJnsArea){
        this.setState({
            modal_delete : true,
            activeItem_Id: idJnsArea
        })
    }


    openModalOnClick(){
    
        this.setState({
        })
        if(this.state.inputtedKodeInsert.length >>  0 && this.state.inputtedNameInsert.length >> 0 && 

            (
                this.state.checkboxValueClassA === true||
                this.state.checkboxValueClassC === true ||
                this.state.checkboxValueClassG === true || 
                this.state.checkboxValueClassS === true)
            
            ){
           
            this.setState({modal_nested:true});
        }
    
       else{
        this.setState({modal_nested:false});
       }
       console.log(this.state.checkboxValueClassA)

    }
//render biasa nya di-isi untuk desain HTML
    render() {
        const { result, isLoading } = this.state;
        return (
            <Page
                title       = "Jenis Area"
                breadcrumbs = {[{ name: 'JenisArea', active: true }]}
                className   = "JenisAreaPage"
            >
                <Card className = "mb-3">
                    <NotificationSystem
                        dismissible={false}
                        ref={notificationSystem =>
                                (this.notificationSystem = notificationSystem)
                            }
                        style={NOTIFICATION_SYSTEM_STYLE}
                    />
{/* ======================================INPUT SEARCH============================== */}
                    <CardHeader className = "d-flex justify-content-between">
                        <Card >
                            <Form inline className="cr-search-form">
                                <MdSearch 
                                    size="20"
                                    className="cr-search-form__icon-search text-secondary"
                                />
                              
                            <Card className = "d-flex">
                                <Input
                                    disabled    ={isLoading}
                                    value       = {this.state.searchInputtedName}
                                    onChange    = {evt => this.setSearchInputState(evt)}
                                    onKeyPress={event =>this.enterPressed(event,true)}
                                    className="cr-search-form__input"
                                    placeholder="Cari.."
                                />    
                                {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                            </Card>
{/* ======================================CLICK SEARCH============================== */}
                                <Card className = "d-flex">
                                    <Button onSubmit={e => e.preventDefault()}  value = {this.state.searchInputtedName}  onClick = {evt => this.searchInputValue(evt)}><MdSearch></MdSearch></Button>
                                </Card>   
                            </Form>
                </Card>
{/* ======================================KETIKA TAMBAH DATA============================== */}
                <Button  onClick = {this.toggle('nested_parent')}>Tambah</Button>
                    <Modal
                        onExit    = {this.handleClose}
                        isOpen    = {this.state.modal_nested_parent}
                        toggle    = {this.toggle('nested_parent')}
                        className = {this.props.className}>
                            <ModalHeader toggle = {this.toggle('nested_parent')}>Tambah Jenis Area</ModalHeader>
                            <ModalBody>
                                    <Label >Kode Area</Label>
                                    <Input 
                                    maxlength = "1"
                                    type     = "kodearea" 
                                    value    = {this.state.inputtedKodeInsert} 
                                    onChange = {evt => this.insertKodeInputValue(evt)} 
                                    name     = "kodearea" 
                                    placeholder = "Kode Jenis Area"/>
                                </ModalBody>

                                <ModalBody>
                                    <Label >Nama Area</Label>
                                    <Input 
                                    type        = "namaarea" 
                                    maxlength   = "40"
                                    value       = {this.state.inputtedNameInsert} 
                                    onChange    = {evt => this.insertNamaInputValue(evt)} 
                                    name        = "namaarea" 
                                    placeholder = "Nama Jenis Area"/>
                                </ModalBody>
                                <ModalBody>
                                    <Label >Class Area</Label>
                                    <table className="table">
                                    <tr>
                                        <th scope="row"></th>
                                        
                                        <td> 
                                        
                                            <Input
                                            type = "checkbox" 
                                            name = "A"
                                            onChange = {evt => this.onCheckChange(evt)} 
                                            value = {this.state.inputtedCheckboxAreaClassA}
                                            //checked ={ this.state.inputtedCheckboxAreaClassA}
                                            placeholder = "Class Jenis Area"/> A  
                                            </td> 
                                        <td> 
                                            <Input 
                                        
                                            type = "checkbox" 
                                            name = "C"
                                            value = {this.state.inputtedCheckboxAreaClassC}
                                            //checked ={ this.state.inputtedCheckboxAreaClassB}
                                            onChange = {evt => this.onCheckChange(evt)} 
                                            placeholder = "Class Jenis Area"/> C  
                                        </td> 
                                    </tr>
                                    <tr>
                                        <th scope="row"></th>
                                        <td> 
                                            <Input 
                                            type = "checkbox"
                                            name = "G"
                                            value = {this.state.inputtedCheckboxAreaClassG}
                                           // checked ={ this.state.inputtedCheckboxAreaClassC}
                                            onChange = {evt => this.onCheckChange(evt)} 
                                            placeholder = "Class Jenis Area"/> G
                                        </td> 
                                        <td> 
                                            <Input 
                                            type = "checkbox" 
                                            name = "S"
                                            value = {this.state.inputtedCheckboxAreaClassS}
                                           //checked ={ this.state.inputtedCheckboxAreaClassD}
                                            onChange = {evt => this.onCheckChange(evt)} 
                                            placeholder = "Class Jenis Area"/> S
                                        </td> 
                                    </tr>  
                                    </table>                                
                                </ModalBody>

                                    <ModalFooter>
                                        <Button 
                                        id = "buttonSimpan" 
                                        color = "primary" 
                                        onClick = {()=>this.openModalOnClick()}>Simpan
                                        </Button>
                                            <Modal
                                                onExit = {this.handleClose}
                                                isOpen = {this.state.modal_nested}
                                                toggle = {this.toggle('nested')}>
                                                <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                    <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                                        <ModalFooter>
                                                            <Button color = "primary" 
                                                            onClick = {this.insertMasterJenisArea()} disabled={isLoading} >
                                                            {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                                                Ya
                                                            </Button>{' '}
                                                                <Button color = "primary" onClick = {this.toggle('nested')}>
                                                                Tidak
                                                            </Button>
                                                        </ModalFooter>
                                                </Modal>
                                                {' '}
                                        <Button color = "primary" onClick = {this.toggle('nested_parent')}>Batal</Button>
                                    </ModalFooter>
                            </Modal>
                      
{/* ======================================KETIKA DELETE DATA(NON-AKTIF DATA YANG AKTIF)============================== */}
                    <Modal
                        isOpen      = {this.state.modal_delete}
                        toggle      = {this.toggle('delete')}
                        className   = {this.props.className}>
                                <ModalHeader toggle = {this.toggle('delete')}>Konfirmasi Penonaktifan</ModalHeader>
                                    <ModalBody>
                                        Apakah Anda yakin ingin menonaktifkan data ini?
                                    </ModalBody>

                                <ModalFooter>
                                    <Button color = "primary"
                                     onClick = {this.deleteJenisArea(this.state.activeItem_Id)}>
                                    {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                        Ya
                                    </Button>{''}
                                    
                                    <Button color = "primary" onClick = {this.toggle('delete')}>
                                        Tidak
                                    </Button>
                                </ModalFooter>
                                        
                    </Modal> 
{/* ====================================== KETIKA EDIT/UPDATE DATA ============================== */}
                    <Modal
                        isOpen      = {this.state.modal_update}
                        toggle      = {this.toggle('update')}
                        className   = {this.props.className}>
                                <ModalHeader 
                                toggle = {this.toggle('update')}> Edit Jenis Area</ModalHeader>
                                    <ModalBody>
                                    <Label >Kode Area</Label>
                                    <Input 
                                    type = "kodearea" 
                                    value = {this.state.inputtedKodeAreaUpdate} 
                                    onChange = {evt => this.updateInputValueKode(evt)}
                                    name = "kodearea" 
                                    maxlength = "1"
                                    placeholder = "Kode Jenis Area"/>
                                    </ModalBody>

                                    <ModalBody>
                                        <Label >Nama Area</Label>
                                        <Input  
                                        type    = "namaarea" 
                                        value   = {this.state.inputtedNamaAreaUpdate} 
                                        maxlength = "40"
                                        onChange = {evt => this.updateInputValueNama(evt)}
                                        name    = "namaarea" 
                                        placeholder = "Nama Jenis Area"
                                            />
                                    </ModalBody>

                                    <ModalBody>
                                    <Label >Class Area</Label>
                                    <table className="table">
                                    <tr>
                                        <th scope="row"></th>
                                        <td>                                         
                                            <Input
                                            type = "checkbox" 
                                            name = "A"
                                            onChange = {evt => this.onCheckChange(evt)} 
                                            value = {this.state.inputtedCheckboxAreaClassA}
                                            checked ={this.state.checkboxValueClassA}
                                            placeholder = "Class Jenis Area"/> A  
                                            </td> 
                                        <td> 
                                            <Input 
                                            type = "checkbox" 
                                            name = "C"
                                            value = {this.state.inputtedCheckboxAreaClassC}
                                            checked ={ this.state.checkboxValueClassC}
                                            onChange = {evt => this.onCheckChange(evt)} 
                                            placeholder = "Class Jenis Area"/> C  
                                        </td> 
                                    </tr>
                                    <tr>
                                        <th scope="row"></th>
                                        <td> 
                                            <Input 
                                            type = "checkbox"
                                            name = "G"
                                            value = {this.state.inputtedCheckboxAreaClassG}
                                            checked ={ this.state.checkboxValueClassG}
                                            onChange = {evt => this.onCheckChange(evt)} 
                                            placeholder = "Class Jenis Area"/> G
                                        </td> 
                                        <td> 
                                            <Input 
                                            type = "checkbox" 
                                            name = "S"
                                           value = {this.state.inputtedCheckboxAreaClassS}
                                            checked ={ this.state.checkboxValueClassS}
                                            onChange = {evt => this.onCheckChange(evt)} 
                                            placeholder = "Class Jenis Area"/> S
                                        </td> 
                                    </tr>  
                                    </table>                    
                                    </ModalBody>

                                <ModalFooter>
                                    <Button 
                                    id = "buttonSimpan" 
                                    color = "primary" 
                                  
                                    onClick = {this.toggle('nested')}>
                                        Simpan
                                    </Button>
                                        
                                        <Modal
                                            isOpen = {this.state.modal_nested}
                                            toggle = {this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                <ModalBody>Apakah Anda yakin ingin mengubah data ini?</ModalBody>
                                                    <ModalFooter>
                                                        <Button color = "primary" 
                                                        onClick = {
                                                            this.setEditJenisArea(
                                                            this.state.activeItem_Id2,
                                                            this.state.inputtedNamaAreaUpdate,
                                                            this.state.inputtedKodeAreaUpdate,
                                                            this.state.inputtedCheckboxAreaClassA,
                                                            this.state.inputtedCheckboxAreaClassC,
                                                            this.state.inputtedCheckboxAreaClassG,
                                                            this.state.inputtedCheckboxAreaClassS)}>
                                                        {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }    
                                                            Ya
                                                        </Button>{' '}
                                                        <Button color = "primary" onClick = {this.toggle('nested')}>
                                                            Tidak 
                                                        </Button>
                                                    </ModalFooter>
                                        </Modal>{' '}
                                                    
                                                        <Button color = "primary" onClick = {this.toggle('update')}>
                                                            Batal
                                                        </Button>
                                </ModalFooter>
                    </Modal>
                    </CardHeader>
                            
                    
                    <CardBody>
                        <Table responsive id="selectedColumn" class="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
{/* ====================================== TABLE DATA DIMANA LIST DATA YANG MUNCUL (TELAH DI DAPAT DR DATABASE ============================= */}
                            <thead>
                                <tr align = "center">
                                    <th className = "th-sm">Kode Area</th>
                                    <th  class="th-sm" >Nama Area</th>
                                    <th  class="th-sm" >Class A</th>
                                    <th  class="th-sm" >Class C</th>
                                    <th  class="th-sm" >Class G</th>
                                    <th  class="th-sm" >Class S</th>
                                    <th  class="th-sm"></th>
                                    <th  class="th-sm"></th>
                                </tr>
                            </thead>
                                <tbody>
                                    {result.map(jnsarea =>
                                        <tr align = "center">
                                            <th scope = "row">{jnsarea.jnsarea_code}</th>   
                                            <td>{jnsarea.jnsarea_name}</td>
                                            <td>{jnsarea.jnsarea_classa}</td>
                                            <td>{jnsarea.jnsarea_classc}</td>
                                            <td>{jnsarea.jnsarea_classg}</td>
                                            <td>{jnsarea.jnsarea_classs}</td>

{/* ====================================== DELETE ============================== */}
                                                    {jnsarea.jnsarea_activeyn === "Y" &&
                                                    <td>
                                                        <Button 
                                                            style={{background: '#FF0000', borderStyle: 'none', 
                                                            justifyContent:'center',alignItems:'center'}}  
                                                            size    = "sm" 
                                                            onClick = {()=>this.openModalWithItemID(jnsarea.jnsarea_runningid)}
                                                        >HAPUS
                                                        </Button>
                                                    </td>
                                                    }
                
{/* ====================================== EDIT ============================== */}
                                                    {jnsarea.jnsarea_activeyn === "Y" &&
                                                    <td>
                                                        <Button 
                                                            color   = "warning"  
                                                            size    = "sm" 
                                                            onClick = {()=> this.updateModalWithItemID(
                                                                jnsarea.jnsarea_runningid, 
                                                                jnsarea.jnsarea_name,
                                                                jnsarea.jnsarea_code,
                                                            jnsarea.jnsarea_classa,
                                                            jnsarea.jnsarea_classc,
                                                            jnsarea.jnsarea_classg,
                                                            jnsarea.jnsarea_classs
                                                            )}
                                                        >EDIT
                                                        </Button>    
                                                    </td>
                                                    }
                                        </tr>
                                    )}
                                </tbody>
                            
                            </Table>
                                <Row>
{/* ====================================== PEMBERIAN LIMIT DATA PER HALAMAN============================== */}
                                    <Col md="6" sm="12" xs="12">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Data per Halaman</InputGroupAddon>
                                                <select 
                                                    name    ="todosPerPage"
                                                    style   ={{height: '38px'}}
                                                    value   ={this.state.value}
                                                    onChange={(e) => this.handleSelect(e)}>
                                                        <option value="5">5</option>
                                                        <option value="10">10</option>
                                                        <option value="20">20</option>
                                                </select>
                                        </InputGroup>
                                    </Col>

                                    <Col md="6" sm="12" xs="12"f>

                                            <InputGroup style={{width:"243px"}}>
                                                <div className = "input-group-prepend">
{/* ====================================== FIRST PAGE ============================== */}
                                                    <Button 
                                                        style={{background: '#2CB7A4', borderStyle: 'none', 
                                                        justifyContent:'center',alignItems:'center'}}  
                                                        className   = "btn btn-info"
                                                        value       = {this.state.currentPage}
                                                        onClick     ={(e) => this.handleFirst(e,-1)}>&lt;&lt;
                                                    </Button>
{/* ====================================== BACK ============================== */}
                                                    <Button 
                                                        style={{background: '#2CB7A4', borderStyle: 'none', 
                                                        justifyContent:'center',alignItems:'center'}} 
                                                        className   = "btn btn-info"
                                                        value       = {this.state.currentPage}
                                                        onClick     ={(e) => this.handleWrite(e,-1)}>&lt;
                                                    </Button>
                                                </div>

                                                <span 
                                                    className   = "text-muted p-2 "  
                                                    style       ={{height: '10px',width:'100px', textAlign: 'center'}} >{this.state.currentPage+1}
                                                </span>
{/* ====================================== NEXT  ============================== */}
                                                <div className = "input-group-append">
                                                    <Button
                                                        style={{background: '#2CB7A4', borderStyle: 'none', 
                                                        justifyContent:'center',alignItems:'center'}} 
                                                        className   = "btn btn-info"
                                                        value       = {this.state.currentPage}
                                                        onClick     ={(e) => this.handleWrite(e,1)}>&gt;
                                                    </Button>
{/* ====================================== LAST PAGE  ============================== */}
                                                    <Button 
                                                        style={{background: '#2CB7A4', borderStyle: 'none', 
                                                        justifyContent:'center',alignItems:'center'}} 
                                                        className   = "btn btn-info"
                                                        value       = {this.state.currentPage}
                                                        onClick     ={(e) => this.handleLast(e)}>&gt;&gt;
                                                    </Button>
                                                </div>    
                                            </InputGroup>
                                    
                                    </Col>
                           
                                </Row> 
                    </CardBody>            
                </Card>                        
            </Page>
        );
    }
}
export default JenisArea;