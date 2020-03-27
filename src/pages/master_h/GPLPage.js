import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import ReactDOM from 'react-dom'
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label,InputGroup,InputGroupAddon,Form,Spinner
} from 'reactstrap';
import { MdSearch, MdLoyalty, MdFormatAlignRight} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import DropdownPage from '../template/DropdownPage';
import { timingSafeEqual } from 'crypto';

const hostUrl = 'https://api.docnet.id/CHCMasterH/MasterGroupPemilikLokasi'

class GPLPage extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            result: [],
            isLoading: false,
            inputtedName: "",
            inputtedName2: "",
            searchInputtedName :"",
            currentPage: 0,
            todosPerPage: 5,
            flag:0,
            totalPage :'',
            hidePagination: 'flex-row',
        
        };
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
        var url = hostUrl+`/TampilSemuaDataGPL/page?size=${currLimit}&page=${currPage}`;
        this.isLoading = true;
        fetch(url)
        .then(response => response.json())
        .then(data => this.setState({ result: data.content, isLoading: false, totalPage: data.totalPages}));
        
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

    handleClose= ()=>{
        this.setState({
            inputtedName2 :''
        });
    }
//state awal pada saat membuka suatu page tsb nanti dicari langsung di render() 
    state = {
        modal              : false,
        modal_backdrop     : false,
        modal_nested_parent: false,
        modal_nested       : false,
        modal_delete       : false,
        modal_update       : false,
        backdrop           : true,
        inputtedName2      : ''
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
insertGPL = param => async ()=> {  
    this.setState({isLoading : true});
    var url     = hostUrl+`/TambahGPL`;
    var payload = {
        gpl_nama  : param,
        gpl_userid: "0"
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
            this.state.inputtedName2       = "";
            this.isLoading = false;
            this.state.modal_nested        = false;
            this.state.modal_nested_parent = false;
            this.componentDidMount();
            return response.json();
        }
    })
    if(data){
        this.showNotification("Data "+param+" Berhasil Disimpan");
    }
    else{
        alert("Data "+param+" Sudah Pernah Ada");
    }
}


//Insert state awal nya dimana tidak boleh special character dan harus semua huruf besar
insertInputValue= (evt) => {
    this.setState({
        inputtedName2: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
    });

}



// --------------------------------------------------------- UPDATE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

//pada saat melakukan edit yang akan di lempar ke backend adalah first_param = nama yang telah di edit, second_param adalah yang didapatkan 
    setEditGPL =  (first_param, second_param,third_param) => async  () => {
        this.setState({isLoading : true});
        var url = hostUrl+`/UbahGPL/${first_param}`;
      
        var payload = {
            gpl_nama    : second_param,
            gpl_userid  : "0",
            gpl_kode    : third_param
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
                    this.isLoading = false;
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
            }
            else{
                alert("Data yang Diubah sama !");
            }
    }
    boolean = false;

//ketika melakukan update, input an yang masuk harus uppercase dan tidak boleh special character
updateInputValue= (evt) => {
    this.setState({
        inputtedName: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
    });
}
// set awal pada saat membuka update 

//(first_param,second_param,third_param)
updateModalWithItemID(idUpdateGPL, namaUpdateGPL,kodeUpdateGPL){
    this.setState({
        modal_update  : true,
        activeItem_Id2: idUpdateGPL,
        inputtedName  : namaUpdateGPL,
        inputtedKode : kodeUpdateGPL
    })
}   


// --------------------------------------------------------- SEARCH --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

//mengambil parameter yang telah diinput di searchInputtedName . lalu dilempar ke Backend
searchInputValue = ()  =>{
    //mengambil data dari backend
    

    //apabila kosong dia tidak akan mencari 
    if(this.state.searchInputtedName.length >>  0){
        this.setState({isLoading : true});
        var url = hostUrl+`/CariGPL/${this.state.searchInputtedName}`;
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
deleteGPL = (param) => async ()=>{
    var url = hostUrl+`/HapusGPL/${param}`;
    var payload = { 
        gpl_userid: "0"
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
    openModalWithItemID(idGPL){
        this.setState({
            modal_delete : true,
            activeItem_Id: idGPL
        })
    }


    openModalOnClick(){
        var namaLokasied = document.getElementById("namaLokasi");
        
        this.setState({
        })
        if(this.state.inputtedName2.length >>  0){
           
            this.setState({modal_nested:true});
        }
       else{
        namaLokasied.oninvalid = true
        this.setState({modal_nested:false});
       }
    }

    
//render biasa nya di-isi untuk desain HTML
    render() {
        const { result, isLoading } = this.state;
        return (
            <Page
                title       = "Group Pemilik Lokasi"
                breadcrumbs = {[{ name: 'GPL', active: true }]}
                className   = "GPLPage"
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
                                    minLength = "0"
                                    disabled    ={isLoading}
                                    value       = {this.state.searchInputtedName}
                                    onChange    = {evt => this.setSearchInputState(evt)}
                                    onKeyPress  ={event =>this.enterPressed(event,true)}
                                    className   ="cr-search-form__input"
                                    placeholder ="Cari.."
                                    
                                />    
                                  {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                            </Card>
{/* ======================================CLICK SEARCH============================== */}
                                <Card className = "d-flex">
                                    <Button onSubmit={e => e.preventDefault()}  value = {this.state.searchInputtedName}  
                                    onClick = {evt => this.searchInputValue(evt)}>
                                    <MdSearch></MdSearch> </Button>
                                </Card>   
                            </Form>
                </Card>
{/* ======================================KETIKA TAMBAH DATA============================== */}
                <Button  
                    onClick = {this.toggle('nested_parent')}
                  
                    >Tambah
                </Button>
                    <Modal
                        isOpen    = {this.state.modal_nested_parent}
                        toggle    = {this.toggle('nested_parent')}
                        className = {this.props.className}
                        onExit  =   {this.handleClose}
                        >
                        
                            <ModalHeader toggle = {this.toggle('nested_parent')}>Tambah Group Pemilik Lokasi</ModalHeader>
                                <ModalBody>
                                    <Label >Nama Lokasi</Label>

                                    <Input 

                                    id = "namaLokasi"
                                    type = "Nama Lokasi" 
                                    value = {this.state.inputtedName2} 
                                    onChange = {evt => this.insertInputValue(evt)} 
                                    name = "namalokasi" 
                                    placeholder = "Nama Group Pemilik Lokasi"/>
                                </ModalBody>
                                    <ModalFooter>
                                        <Button 
                                        id = "buttonSimpan" 
                                        color = "primary" 
                                        onClick = {()=>this.openModalOnClick()}>
                                        Simpan
                                        </Button>
                                            <Modal
                                                onKeyPress={event =>this.enterPressedInsert(event,true)}
                                                isOpen = {this.state.modal_nested}
                                                toggle = {this.toggle('nested')}
                                                onExit  =   {this.handleClose}>
                                                <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                    <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                                        <ModalFooter>
                                                            <Button color = "primary" onClick = {this.insertGPL(this.state.inputtedName2)} disabled={isLoading} >
                                                            {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                                                Ya
                                                            </Button>{' '}
                                                            <Button color = "primary" onClick = {this.toggle('nested')} >
                                                                Tidak
                                                            </Button>
                                                        </ModalFooter>
                                                </Modal>
                                                {' '}
                                        <Button color = "primary" onClick = {this.toggle('nested_parent')}  >Batal</Button>
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
                                    <Button color = "primary" onClick = {this.deleteGPL(this.state.activeItem_Id)}>
                                    {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                        Ya
                                    </Button>{''}
                                    
                                    <Button color = "primary" onClick = {this.toggle('delete')}>
                                        Tidak
                                    </Button>
                                </ModalFooter>
                                        
                    </Modal> 
{/* ======================================KETIKA EDIT/UPDATE DATA============================== */}
                    <Modal
                        isOpen      = {this.state.modal_update}
                        toggle      = {this.toggle('update')}
                        className   = {this.props.className}>
                                <ModalHeader toggle = {this.toggle('update')}> Edit Group Pemilik Lokasi</ModalHeader>
                                    <ModalBody>
                                        <Label >Nama Ekspedisi</Label>
                                            <Input  type    = "namalokasi" 
                                                    value   = {this.state.inputtedName} onChange = {evt => this.updateInputValue(evt)}
                                                    name    = "namalokasi" placeholder = "Nama Group Pemilik Lokasi"
                                            />
                                    </ModalBody>
                                <ModalFooter>
                                    <Button id = "buttonSimpan" color = "primary" onClick = {this.toggle('nested')}>
                                        Simpan
                                    </Button>
                                        
                                        <Modal
                                            isOpen = {this.state.modal_nested}
                                            toggle = {this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                <ModalBody>Apakah Anda yakin ingin mengubah data ini?</ModalBody>
                                                    <ModalFooter>
                                                        <Button color = "primary" 
                                                        onClick = {this.setEditGPL(this.state.activeItem_Id2,this.state.inputtedName,this.state.inputtedKode)}>
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
{/* ====================================== TABLE DATA DIMANA LIST DATA YANG MUNCUL (TELAH DI DAPAT DR DATABASE)============================= */}
                            <thead>
                                <tr>
                                    <th className = "th-sm">Kode GPL</th>
                                    <th  class="th-sm" >Nama GPL</th>
                                    <th  class="th-sm"></th>
                                    <th  class="th-sm"></th>
                                </tr>
                            </thead>
                                <tbody>
                                    {result.map(gpl =>
                                        <tr>
                                            <th scope = "row">{gpl.gpl_code}</th>
                                            <td>{gpl.gpl_name}</td>

{/* ====================================== DELETE ============================== */}
                                                    {gpl.gpl_activeyn === "Y" &&
                                                    <td>
                                                
                                                        <Button 
                                                            style={{background: '#FF0000', borderStyle: 'none', 
                                                            justifyContent:'center',alignItems:'center'}}  
                                                            size    = "sm" 
                                                            onClick = {()=>this.openModalWithItemID(gpl.gpl_runningid)}
                                                        >HAPUS
                                                        </Button>
                                                    </td>
                                                    }
                
{/* ====================================== EDIT ============================== */}
                                                    {gpl.gpl_activeyn === "Y" &&
                                                    <td>
                                                        <Button 
                                                            color   = "warning"  
                                                            size    = "sm" 
                                                            onClick = {()=> this.updateModalWithItemID(gpl.gpl_runningid, gpl.gpl_name,gpl.gpl_code)}
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
export default GPLPage;