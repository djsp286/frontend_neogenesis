import Page from 'components/Page';
import React from 'react';
import {
    Button, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Form,
    UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    InputGroup, InputGroupAddon
} from 'reactstrap';
import { MdAdd, MdDelete, MdSearch, MdEdit } from 'react-icons/md';

class BrandPage extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state  = {
            result          : [],
            inputtedName    : '',
            selectedDropdown: "Show All",
            currentPage     : 1,
            todosPerPage    : 5,
            flag            : 0,
            pageCount       : 0,
            displayStatus   : "none",
            waitAsync       : true
        };
    }
    
    connectionOut(message, render){
        console.log("masuk");
        if(render){
            this.setState({
                modal_backdrop      : false,
                modal_nested_parent : false,
                modal_nested        : false,
                backdrop            : true,
                modal_delete        : false,
                modal_response      : true,
                modal_edit          : false,
                modal_confirm_edit  : false,
                searchType          : "Show_All",
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            },  () => this.getCountPage())
        }else{
            this.setState({
                modal_backdrop      : false,
                modal_nested_parent : false,
                modal_nested        : false,
                backdrop            : true,
                modal_delete        : false,
                modal_response      : true,
                modal_edit          : false,
                modal_confirm_edit  : false,
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            })
        }
    }

    state = {
        modal              : false,
        modal_backdrop     : false,
        modal_nested_parent: false,
        modal_nested       : false,
        modal_delete       : false,
        modal_response     : false,
        modal_edit         : false,
        modal_confirm_edit  : false,
        backdrop           : true,
        responseHeader     : "",
        responseMessage    : "",
    };

    componentDidMount() {
        this.getCountPage();
       
    }

    getCountPage(){
        console.log("todoperpage : "+this.state.todosPerPage);
        if(this.state.keyword!=null && this.state.keyword!=""){
            if (this.state.searchType==="Name"){
                console.log("dfds1" + this.state.todosPerPage)
                var braModel = {
                    Name  : this.state.keyword,
                    Code  : "",
                    Limit : parseInt(this.state.todosPerPage),
                }
            }
            else if (this.state.searchType==="Code"){
                console.log("dfds2" + this.state.todosPerPage)
                var braModel = {
                    Name  : "",
                    Code  : this.state.keyword,
                    Limit : parseInt(this.state.todosPerPage),
                }
            }
        }else{
            console.log("dfds3" + this.state.todosPerPage)
            var braModel = {
                Name  : "",
                Code  : "",
                Limit : parseInt(this.state.todosPerPage),
            }
        }  
        var url     = `https://api.docnet.id/CHCMasterD/MasterBrand/HitungDataBrand`;

        fetch(url, {
            method : "POST",
            body   : JSON.stringify(braModel),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log("bramodel : "+JSON.stringify(braModel))
                console.log(response)       
                console.log("response count : "+response.Data);
                        if(response.Data === 0){
                            this.setState({ 
                                responseHeader  : "Warning",
                                responseMessage : "Data is empty",
                                modal_response  : true,
                                pageCount       : 1,
                                result          : []
                            });
                           
                            console.log("rmasuk if response count=0");
                        }
                        
                        else{
                            console.log("response count : "+response.Data);
                            this.state.pageCount = response.Data;    
                            console.log("count pagecount: "+this.state.pageCount) 
                            this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
                        }             
        }, ()=>  this.connectionOut("Can't reach the server", false));
    }


    getListbyPaging(currPage,currLimit)
    {   
            if (this.state.searchType==="Name"){
                var url     = `https://api.docnet.id/CHCMasterD/MasterBrand/CariNamaBrandPage`;
                var payload = {
                    Bra_BrandedName : this.state.keyword,
                    Start           : parseInt(currPage),
                    Length          : parseInt(currLimit),
                }
        
                fetch(url, {
                    method : "POST",
                    body   : JSON.stringify(payload),
                    json   : true,
                    headers:{
                             "Content-type": "application/json; charset=UTF-8"
                            }
                    })
                    .then(response => response.json())
                    .then(data => this.setState({ 
                        result: data.Data, 
                        }));
            }
            else if(this.state.searchType==="Code"){
                console.log(url);
                var url     = `https://api.docnet.id/CHCMasterD/MasterBrand/CariKodeBrandPage`;
                var payload = {
                    Bra_BrandedCode : this.state.keyword,
                    Start           : parseInt(currPage),
                    Length          : parseInt(currLimit),
                }
        
                fetch(url, {
                    method : "POST",
                    body   : JSON.stringify(payload),
                    json   : true,
                    headers: {
                         "Content-type": "application/json; charset=UTF-8"
                    }
                 })
                .then(response => response.json())
                .then(data => this.setState({ 
                    result: data.Data, 
                }));
                }
            else{
                var payload = {
                Start   : parseInt(currPage),
                Length  : parseInt(currLimit),
                };
                const option = {
                    method  : "POST",
                    json    : true,
                    headers : {
                            "Content-Type": "application/json;charset=UTF-8"
                            },
                    body: JSON.stringify(payload)
                    }
                    
                    fetch("https://api.docnet.id/CHCMasterD/MasterBrand/TampilkanBrandPage",option)
                    .then(response => response.json())
                    .then(data =>{ 

                        try {
                            if(data.Data === null) {
                                console.log("data kosong")            
                                this.setState({ result: []})
                                if(this.state.currentPage!=1){
                                    this.state.currentPage = this.state.currentPage-1
                                    this.getCountPage()
                                }
                            }
                            else{
                                console.log("data count : "+ data.Data.Length)
                                console.log("data tidak kosong")  
                                this.setState({ result: data.Data})
                            }
                        } catch (error) {
                            this.connectionOut("Can't reach the server", false)
                        }
                           
                        });
                }
         }

    insertMasterBrand = param => () => {
        if(this.state.inputtedName.length > 15){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama brand tidak boleh melebihi 15 karakter",
                modal_response  : true})
        }else if(this.state.inputtedName == "")
        {
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama brand tidak boleh kosong",
                modal_response  : true})
        }
        else{
        var url     = `https://api.docnet.id/CHCMasterD/MasterBrand/TambahBrand`;
        var payload = {
            Bra_BrandedName  : this.state.inputtedName,
            Bra_MgrAuto      : this.state.inputtedMarginFix,
            Bra_AutoCom      : this.state.inputtedAutoCom,
            Bra_Selisih      : this.state.inputtedSelisih,       
            Bra_HppCom       : this.state.inputtedHPP_COM,
            Bra_HrgCom       : this.state.inputtedHargaCom
        }
        console.log(url);

        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log("RESPONSE STATUS : "+response.status)
                if (response.ResponseCode = "200") {
                    console.log("jalan true : ")
                    this.state.modal_nested        = false;
                    this.state.modal_nested_parent = false;
                    this.state.inputtedName="";
                    this.state.currentPage = this.state.pageCount;
                    this.componentDidMount();
                    this.state.responseHeader  = "Add Data";
                    this.state.responseMessage = "Data berhasil ditambah"; 
                    this.state.modal_response  = true;              
                }
                else if (response.ResponseCode = "405"){
                    console.log("jalan false : ")
                    this.state.modal_nested        = false;
                    this.state.modal_nested_parent = false; 
                    this.state.inputtedName="";
                    this.componentDidMount();
                    this.state.responseHeader  = "Add Data";
                    this.state.responseMessage = "Data sudah ada";
                    this.state.modal_response  = true;
                    
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    editMasterBrand = param => () => {
        if(isNaN(this.state.activeMarginFixEdit)){
            this.setState({
                responseHeader      : "Warning",
                responseMessage     : "Margin Fix harus angka",
                modal_response      : true,
                modal_confirm_edit  : false})
        }else if(isNaN(this.state.activeHPP_ComEdit)){
            this.setState({
                responseHeader      : "Warning",
                responseMessage     : "HPP_Com harus angka",
                modal_response      : true,
                modal_confirm_edit  : false})
        }else if(isNaN(this.state.activeHargaComEdit)){
            this.setState({
                responseHeader      : "Warning",
                responseMessage     : "Harga Com harus angka",
                modal_response      : true,
                modal_confirm_edit  : false})
        }
        else{
        var url     = `https://api.docnet.id/CHCMasterD/MasterBrand/UbahBrand`;
        var payload = {
            Bra_BrandedCode  : this.state.activeIdEdit,
            Bra_BrandedName  : this.state.activeNameEdit,
            Bra_MgrAuto      : parseFloat(this.state.activeMarginFixEdit),
            Bra_AutoCom      : parseFloat(this.state.activeAutoComEdit),
            Bra_Selisih      : parseFloat(this.state.activeSelisihEdit),       
            Bra_HppCom       : parseFloat(this.state.activeHPP_ComEdit),
            Bra_HrgCom       : parseFloat(this.state.activeHargaComEdit),
            Bra_UserID       : this.state.activeuserID
        }

        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log("RESPONSE STATUS : "+response.status)
                if (response.ResponseCode = "200") {
                    console.log("jalan true : ")
                    this.state.modal_confirm_edit = false; 
                    this.state.modal_edit         = false;
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Data berhasil diedit"; 
                    this.state.modal_response  = true;              
                }
                else if (response.ResponseCode = "410"){
                    console.log("jalan false : ")
                    this.state.modal_confirm_edit = false; 
                    this.state.modal_edit         = false;
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Tidak ada perubahan data";
                    this.state.modal_response  = true;
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }


    deleteMasterBrand = param => () => {
        var url = `https://api.docnet.id/CHCMasterD/MasterBrand/HapusBrand`;
        console.log(url);
        var payload = {
            Bra_BrandedCode  : param,
        }

        fetch(url, {
            method : 'POST',
            body   : JSON.stringify(payload),
            JSON   : true, 
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
            .then(response => {
                if (response.ResponseCode = "200") {
                    console.log("jalan true : ")
                    this.state.modal_delete    = false;
                    this.state.responseHeader  = "Delete Data";
                    this.state.responseMessage = "Data berhasil dihapus";
                    this.state.modal_response  = true;
                    this.componentDidMount();
                }
                else if (response.ResponseCode = "400"){    
                    console.log("jalan false : ")
                    this.state.modal_delete    = false;
                    this.state.responseHeader  = "Delete Data";
                    this.state.responseMessage = "Data gagal dihapus";
                    this.state.modal_response  = true;
                    this.componentDidMount();      
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
    }

    
    
    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value },() =>{
                this.state.currentPage = 1;
                this.getCountPage();
        });
    }

      //set Current Page
    handleWrite(event,flag) {
        console.log("karin : "+this.state.currentPage + flag)
        console.log("karin2 : "+Number(event.target.value))

        if((this.state.currentPage + flag) > 0){
            this.setState({
                currentPage: Number(event.target.value) + flag
            });
        }
        console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));
        
        if((this.state.currentPage + flag) > this.state.pageCount){
            this.setState({
                currentPage: this.state.pageCount
            });
            console.log("masuk sini1")
        }
        else{
            if(this.state.currentPage + flag != 0){
                this.getCountPage();
                console.log("masuk sini")
            }   
            console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.todosPerPage);
        }
      }

      
    handleFirst(event) {
        this.setState({
            currentPage: 1
        },() => this.getCountPage());
    }

    handleLast(event, page) {
        this.setState({
            currentPage: page
        },() => this.getCountPage());
    }

    openModalWithItemID(code, name){
        this.setState({
            modal_delete: true,
            activeItemId: code,
            activeName  : name
        })
    }

    openModalEditWithItemID(code, name, marginfix, autocom, selisih, hpp_com, hargacom, userID){
        this.setState({
            modal_edit          : true,
            activeIdEdit        : code,
            activeNameEdit      : name,
            activeMarginFixEdit : marginfix,
            activeAutoComEdit   : autocom,
            activeSelisihEdit   : selisih,
            activeHPP_ComEdit   : hpp_com,
            activeHargaComEdit  : hargacom,
            activeuserID        : userID

        })
    }

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    
    updateInputValue (type, event) {
        if (type === "NamaBrand") {
            this.setState({ 
              inputtedName: event.target.value 
            });
          } else if(type === "MarginFix"){
            this.setState({
              inputtedMarginFix: event.target.value
            });
          } else if(type === "AutoCom"){
            this.setState({
              inputtedAutoCom: event.target.value
            });
          } else if(type === "Selisih"){
              this.setState({
                inputtedSelisih: event.target.value
              });
          } else if(type === "HPP_COM"){
              this.setState({
                inputtedHPP_COM: event.target.value
              });
          } else if(type === "HargaCom"){
              this.setState({
                inputtedHargaCom: event.target.value
              });
          }
    };

    handleChange = (type, event) => {
        if (type === "EditMarginFix"){
            this.setState({
            activeMarginFixEdit : event.target.value
            });
        } else if (type === "EditHPP_COM"){
            this.setState({
            activeHPP_ComEdit : event.target.value
            });
        } else if (type === "EditHargaCom"){
            this.setState({
            activeHargaComEdit : event.target.value
            });
        }
      };

    updateSearchValue(evt){
        console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    enterPressedSearch(event){
        console.log(this.state.currentPage)
        console.log(this.state.todosPerPage)
        var code = event.keyCode || event.which;
        if(code === 13){
            
            this.state.currentPage = 1;
            this.getCountPage();
        }
       
    }

    sendSearchParam = (keyword,currentPage,todosPerPage) => () =>{
        console.log("search : "+this.state.keyword);
        this.getCountPage();
        
    }

    updateSelectionValue(evt){
        this.setState({
            [evt.target.name]: evt.target.value,
            selectedDropdown : evt.target.value
        });

        if(evt.target.value==="Code")
        {
            this.setState({
                searchType:"Code",
                displayStatus: 'inline-flex'
            })   
        }

        else if(evt.target.value==="Name")
        {
            this.setState({
                searchType:"Name",
                displayStatus: 'inline-flex'
            }) 
        }

        else if(evt.target.value === "Show All"){
            document.getElementById('inputSearch').value = "";
        
            this.setState({
                currentPage: 1,
                keyword: "",
                displayStatus: 'none'
            },() => {
            this.componentDidMount();
            });
        }

    }

    render() {
        const { result } = this.state;
        console.log(result)

        return (
            <Page
            title       = "Brand"
            breadcrumbs = {[{ name: 'brand', active: true }]}
            className   = "BrandPage">
                
                <Row>
                    <Col>
                    <Card       className = "mb-3">
                        <CardHeader className = "d-flex justify-content-between">
                            <UncontrolledButtonDropdown
                            style={{
                                marginRight: "1.5vw"
                            }}
                            >
                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                    {this.state.selectedDropdown}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem value = "Show All" onClick = {evt => this.updateSelectionValue(evt)}>Show All</DropdownItem>
                                    <DropdownItem value = "Name" onClick = {evt => this.updateSelectionValue(evt)}>Name</DropdownItem>
                                    <DropdownItem value = "Code" onClick = {evt => this.updateSelectionValue(evt)}>Code</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            
                            <Input
                            id          = "inputSearch"
                            type        = "search"
                            placeholder = "Search..."
                            onChange   = {evt => this.updateSearchValue(evt)}
                            onKeyPress = {evt => this.enterPressedSearch(evt)}
                            style={{
                                display: this.state.displayStatus
                            }}/>
                            
                            <Button   
                            size = "sm" 
                            onClick = {this.sendSearchParam(this.state.keyword, this.state.currentPage, this.state.todosPerPage)}
                            style = {{
                                marginRight: "1.5vw",
                                display: this.state.displayStatus
                            }}>
                                <MdSearch size = "18"></MdSearch>
                                </Button>
                                <Button 
                                size = "sm" 
                                color = "primary" 
                                onClick = {this.toggle('nested_parent')} 
                                style = {{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    float: "right",
                                }}>
                                    <MdAdd 
                                    style ={{
                                        marginRight: "5px"
                                    }}>
                                        </MdAdd>ADD
                                        </Button>
                            
                                <Modal
                                isOpen    = {this.state.modal_nested_parent}
                                toggle    = {this.toggle('nested_parent')}
                                className = {this.props.className}>
                                    <ModalHeader toggle = {this.toggle('nested_parent')}>
                                        Tambah Brand
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Brand</Label>
                                        <Input type = "Nama Brand" value = {this.state.inputtedName} onChange = {(e) => this.updateInputValue("NamaBrand",e)} name = "namabrand" placeholder = "Nama Brand" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color = "primary" onClick = {this.toggle('nested')}>
                                            Simpan
                                    </Button>
                                        <Modal
                                            isOpen = {this.state.modal_nested}
                                            toggle = {this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color = "primary" onClick = {
                                                    this.insertMasterBrand(this.state.inputtedName)}>
                                                    Ya
                                                </Button>{' '}
                                                <Button
                                                    color   = "secondary"
                                                    onClick = {this.toggle('nested')}>
                                                    Tidak
                                            </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color = "secondary" onClick = {this.toggle('nested_parent')}>
                                            Batal
                                         </Button>
                                    </ModalFooter>
                                </Modal>

                                <Modal
                                    isOpen={this.state.modal_response}
                                    toggle={this.toggle('response')}
                                >
                                    <ModalHeader>
                                        {this.state.responseHeader}
                                    </ModalHeader>
                                    <ModalBody>
                                        {this.state.responseMessage}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="success" onClick={ () => { this.setState({ modal_response: false, modal_nested: false}) } }>OK</Button>
                                    </ModalFooter>
                                 </Modal>

                                <Modal
                                    isOpen = {this.state.modal_delete}
                                    toggle = {this.toggle('delete')}>
                                    <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                                    <ModalBody>Apakah Anda yakin ingin menghapus data {this.state.activeName} ini?</ModalBody>
                                    <ModalFooter>
                                        <Button color = "primary" onClick = {this.deleteMasterBrand(this.state.activeItemId)}>
                                            Ya
                                        </Button>{' '}
                                        <Button
                                            color   = "secondary"
                                            onClick = {this.toggle('delete')}>
                                            Tidak
                                        </Button>
                                    </ModalFooter>
                               </Modal>

                               <Modal
                                isOpen    = {this.state.modal_edit}                       
                                className = {this.props.className}>
                                    <ModalHeader toggle = {this.toggle('edit')}>
                                        Edit Data
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label></Label>
                                        <Input type = "text" 
                                        value = {this.state.activeNameEdit} 
                                        name = "namabrand" 
                                        />
                                        <Label>Margin Fix</Label>
                                        <Input type = "text" 
                                        value = {this.state.activeMarginFixEdit} 
                                        onInput={(e) => this.handleChange("EditMarginFix",e)}
                                        name = "marginfix" 
                                        />
                                        <Label>Auto Com</Label>
                                        <Input type = "text" disabled
                                        value = {this.state.activeAutoComEdit} 
                                        name = "autocom" 
                                        />
                                        <Label>Selisih</Label>
                                        <Input type = "text" disabled
                                        value = {this.state.activeSelisihEdit} 
                                        name = "selisih" 
                                        />
                                        <Label>HPP_COM</Label>
                                        <Input type = "text" 
                                        value = {this.state.activeHPP_ComEdit} 
                                        onInput={(e) => this.handleChange("EditHPP_COM",e)}
                                        name = "hpp_com" 
                                        />
                                        <Label>Harga Com</Label>
                                        <Input type = "text" 
                                        value = {this.state.activeHargaComEdit} 
                                        onInput={(e) => this.handleChange("EditHargaCom",e)}
                                        name = "hargacom" 
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color = "primary" onClick = {this.toggle('confirm_edit')}>
                                            Simpan
                                    </Button>
                                        <Modal
                                            isOpen = {this.state.modal_confirm_edit}
                                            >
                                            <ModalHeader>Konfirmasi Edit</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin edit data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color = "primary" onClick = {
                                                    this.editMasterBrand(this.state.inputtedName)}>
                                                    Ya
                                                </Button>{' '}
                                                <Button
                                                    color   = "secondary"
                                                    onClick = {this.toggle('confirm_edit')}>
                                                    Tidak
                                            </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color = "secondary" onClick = {this.toggle('edit')}>
                                            Batal
                                         </Button>
                                    </ModalFooter>
                                </Modal>
                               
                            </CardHeader>
                            <CardBody>
                                <Table
                                style={{
                                    marginTop: "15px"
                                }} 
                                responsive>
                                    <thead>
                                        <tr width = "100%">
                                        <th>Kode Brand</th>
                                        <th>Nama Brand</th>
                                        <th>Margin Fix</th>
                                        <th>Auto Com</th> 
                                        <th>Selisih</th>
                                        <th>HPP_COM</th>
                                        <th>Harga Com</th> 
                                        <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map(brand => 
                                            <tr>
                                                <th scope = "row">{brand.Bra_BrandedCode}
                                                </th>
                                                <td>{brand.Bra_BrandedName}</td>
                                                {console.log(brand.Bra_ActiveYN)}
                                                <td>{brand.Bra_MgrAuto}</td>
                                                <td>{brand.Bra_AutoCom}</td>
                                                <td>{brand.Bra_Selisih}</td>
                                                <td>{brand.Bra_HppCom}</td>
                                                <td>{brand.Bra_HrgCom}</td>
                                                <td>
                                                    
                                                    <Button size = "sm" 
                                                    onClick = {()=>this.openModalEditWithItemID(brand.Bra_BrandedCode, brand.Bra_BrandedName, brand.Bra_MgrAuto,
                                                        brand.Bra_AutoCom, brand.Bra_Selisih, brand.Bra_HppCom, brand.Bra_HrgCom, brand.Bra_UserID)} 
                                                        color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                                        <MdEdit style = {{marginRight: "7px"}}></MdEdit>Edit</Button>

                                                    <Button size = "sm" onClick = {
                                                        ()=>this.openModalWithItemID(brand.Bra_BrandedCode, brand.Bra_BrandedName)} 
                                                        color = "danger" style = {{display: "inline-flex", alignItems: "center"}}>
                                                        <MdDelete style = {{marginRight: "7px"}}></MdDelete>Delete</Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>

                            <InputGroup
                                style={{
                                    marginLeft:"1.5vw"
                                }}>
                                    <InputGroupAddon>Data per Page</InputGroupAddon>
                                    <select 
                                    name="todosPerPage"
                                    value={this.state.value}
                                    onChange={(e) => this.handleSelect(e)}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                    </select>
                            </InputGroup>
                            
                            <br/>
                            
                            <Form
                            inline
                            className="cr-search-form"
                            style={{
                                textAlign:"center",
                                justifyContent:"center",
                                marginBottom: "20px"
                            }}>
                                <Button
                                value = {this.state.currentPage}
                                onClick={(e) => this.handleFirst(e)}>First</Button>
                                <Button 
                                value = {this.state.currentPage}
                                onClick={(e) => this.handleWrite(e,-1)}>Prev</Button>


                                <Button
                                disabled
                                style={{width:'auto'}}
                                color= "primary">
                                {this.state.currentPage+" / "+this.state.pageCount}
                                </Button>

                                <Button
                                value = {this.state.currentPage}
                                onClick={(e) => this.handleWrite(e,1)}>Next</Button>

                                <Button 
                                value = {this.state.currentPage} 
                                onClick={(e) => this.handleLast(e,this.state.pageCount)}>Last</Button>
                             </Form>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }

}
export default BrandPage;
