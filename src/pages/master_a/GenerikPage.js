import Page from 'components/Page';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap';
import { MdAdd, MdDelete, MdEdit, MdInfo, MdSearch } from 'react-icons/md';
import * as s_url from '../urlLinkMasterA';
import * as Request from '../../custom_functions/Request';
import SizeDropDown from '../../custom_components/SizeDropDown';
import ModalMessage from '../../custom_components/ModalMessage';
import ModalConfirmation from '../../custom_components/ModalConfirmation';
import PageNav from '../../custom_components/PageNav';

class GenerikPage extends React.Component {

    constructor(props) {
        super(props);
        
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.state = {
            result: [],
            isLoading: false,
            inputtedName: '',
            inputtedAturan: '',
            updateAturan: '',
            searchType: "",
            keyword: "",
            selectedDropdown:"All",

            page: 1,
            size: 10,
            count: 0,

            gen_code:0,
            gen_nama:"",
            gen_dosage: "",
            gen_psikotropika: false,

            modal: false,
            modal_backdrop: false,
            modal_nested_parent: false,
            modal_nested: false,
            modal_delete: false,
            modal_edit: false,
            modal_message: false,
            modal_aturanPakai: false,
            backdrop: true,
            dropdownOpen: false,
        };
    }

    //request
    pagecount(){
        var  url = s_url.url_TampilSemuaGenerik;

        if( this.state.searchType === "Generik_Kode"){url = s_url.url_CariKodeGenerik_Count;}
        if( this.state.searchType === "Generik_Nama"){url = s_url.url_CariNamaGenerik_Count;}

        if(url === s_url.url_TampilSemuaGenerik){

            Request.Get(
                url,

                data =>
                {

                  this.setState({count: data.responseCount},
                    () => this.pageRender()
                  );

                },

                () => this.popUpMessage("cannot reach the server",false),
                () => this.popUpMessage("cannot reach the server",false)
            );

        }
        else{

            var formdata = {
                keyword:(this.state.keyword).trim()
            };

            Request.Post(
                url,
                formdata,

                data => this.setState({count: data.responseCount}, () => this.pageRender()),

                () => this.popUpMessage("cannot reach the server",false),
                () => this.popUpMessage("cannot reach the server",false)
            );

        }
    }

    pageRender(){
        var page = this.state.page;
        var size = this.state.size;
        var count = this.state.count;
        var initial_index = size*(page-1);

        count = count <= 0 ? 1 : count;
        while (initial_index>=count){
            page--;
            initial_index = size*(page-1);
        }
        
        var  url = s_url.url_CetakGenerik_Halaman;

        if( this.state.searchType === "Generik_Kode"){url = s_url.url_PencarianKodeGenerik_Halaman;}
        if( this.state.searchType === "Generik_Nama"){url = s_url.url_PencarianNamaGenerik_Halaman;}

        this.setState({ isLoading: true });

        var formdata = {
          page: page,
          size: size,
          keyword:(this.state.keyword).trim()//ignored in CetakGenerik
        };

        Request.Post(
            url,
            formdata,

            data => this.setState({result: data.responseData ,page: page, isLoading: false}),


            () => this.popUpMessage("cannot reach the server",false),
            () => this.popUpMessage("cannot reach the server",false)
        );

    }

    insertMasterGenerik(param1,param2,param3){
      var url = s_url.url_TambahGenerik;
      var tf;

      if(param3){
        tf = "Y"
      }
      else{
        tf = "N"
      }

      var payload = {
        Gen_Name: param1,
        Gen_UserID: "COVERT",
        Gen_Dosage: param2,
        Gen_Psikotropika: tf
      };

      Request.Post(
          url,
          payload,

          data => this.popUpMessage(data.responseMessage, true),

          () => this.popUpMessage("Cannot reach the server", false),
          () => this.popUpMessage("Cannot reach the server", false)

      );

    }

    updateGenerik(){
      var url = s_url.url_EditGenerik;

      var payload = {
        Gen_Code: this.state.gen_Code,
        Gen_UserID: "COVERT",
        Gen_Dosage: this.state.gen_Dosage

      };

      Request.Post(
          url,
          payload,

          data => this.popUpMessage(data.responseMessage, true),

          () => this.popUpMessage("Cannot reach the server", false),
          () => this.popUpMessage("Cannot reach the server", false)

      );
    }

    deleteDataValue () {
      var url = s_url.url_HapusGenerik;
      var payload = {
        Gen_Code: this.state.gen_Code,
        Gen_UserID: "COVERT"

      };

      Request.Post(
          url,
          payload,

          data => this.popUpMessage(data.responseMessage, true),

          () => this.popUpMessage("Cannot reach the server", false),
          () => this.popUpMessage("Cannot reach the server", false)

      );
    }

    //initial
    componentDidMount() {
        this.pagecount();
    }

    //toggle
    toggle(modalType){
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            },()=>console.log("SALAH MODAL"));
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    toggledelete(code,nama){
        this.setState({
            modal_delete:true,
            gen_Code:code,
            gen_Name:nama
        })
    }

    toggleedit(code,nama,aturan,psikotropika){
        this.setState({
            modal_edit: true,
            gen_Code: code,
            gen_Name: nama,
            gen_Dosage: aturan,
            gen_Psikotropika: psikotropika
        })
    }

    toggleAturanPakai(code, aturan){
        this.setState({
            modal_aturanPakai: true,
            gen_Code: code,
            gen_Dosage: aturan
        })
    }

    toggleDropDown() {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
    }


    //update
    updateInputValue(evt) {
      
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateInputValueAturan(evt){
        this.setState({
            inputtedAturan: evt.target.value
        });
    }

    updateInputValueUpdateDosage(evt){
        this.setState({
            gen_Dosage: evt.target.value
        });
    }

    updateSearchValue(evt){
        //console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    updateSelectionValue(evt){
      this.setState({
        selectedDropdown: evt.target.value
      },() => {
        if(this.state.selectedDropdown === "All"){
          this.setState({ searchType:"Show_All",
            page : 1},() => this.pagecount())

        }
      });

    }

    updateSizeValue(evt){
      this.setState({size : evt.target.value},
        () =>
          this.pagecount()
      );

    }

    updatePageValue(number){
      this.setState({page : number},
        () =>
          this.pagecount()
      );
    }

    checkPsikotropika(evt){
      this.setState({
        gen_psikotropika: evt.target.checked
      });
    }

    //other
    enterPressed(evt){
        var code = evt.keyCode || evt.which;
        if (code === 13){ //13 adalah kode untuk keyword
            this.searchPage()
        }
    }

    searchPage(){

        var search = "";
        if(this.state.selectedDropdown==="Kode"){search = "Generik_Kode";}
        if(this.state.selectedDropdown==="Nama"){search = "Generik_Nama";}
        if(this.state.selectedDropdown==="All" ){search = "Show_All";}

        this.setState({searchType:search,page : 1},() => this.pagecount())
    }

    popUpMessage(message,render){
    if(render){

      this.setState({
        message: message,
        inputtedName: "",
        inputtedAturan: "",
        modal_delete: false,
        modal_nested: false,
        modal_nested_parent: false,
        modal_message:true,
        modal_edit: false,
        searchType:"Show_All"

      },  () => this.pagecount())

    }else{

      this.setState({
        message: message,
        inputtedName: "",
        inputtedAturan: "",
        modal_delete: false,
        modal_nested: false,
        modal_nested_parent: false,
        modal_message:true,
        modal_edit: false,
        searchType:"Show_All"

      })

    }
  }

    //render
    render() {
        const { result, isLoading, page, count, size } = this.state;
        const maxpage = Math.ceil(count/size);
        var search, sizeDropDown, pageNav;
        var sizeArray = [3,5,10,25];
        var s_disable = false;
        var modal_message,modal_add,modal_delete,modal_edit,modal_aturan;
        var tableHead,tableBody;

        if(this.state.selectedDropdown == "All"){
            s_disable = true;
        }

        search =    <InputGroup style={{marginRight:"5px"}}>
                        <InputGroupButtonDropdown style={{marginRight:"10px"}}  color="primary" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                            <DropdownToggle caret>{this.state.selectedDropdown}</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem value="All"  onClick={evt => this.updateSelectionValue(evt)}>SHOW ALL</DropdownItem>
                                    <DropdownItem value="Kode" onClick={evt => this.updateSelectionValue(evt)}>KODE GENERIK</DropdownItem>
                                    <DropdownItem value="Nama" onClick={evt => this.updateSelectionValue(evt)}>NAMA GENERIK</DropdownItem>
                                </DropdownMenu>
                        </InputGroupButtonDropdown>
                        <Input disabled={s_disable}
                        placeholder="Search..."
                        onKeyPress={evt => this.enterPressed(evt)}  
                        onChange={evt => this.updateSearchValue(evt)}
                        />
                        <InputGroupAddon addonType="append"><Button disabled={s_disable} onClick={() => this.searchPage()}>
                            <MdSearch size="18"></MdSearch>
                            </Button></InputGroupAddon>
                    </InputGroup>
        ;

        sizeDropDown = <SizeDropDown
             onClick={e => this.updateSizeValue(e)}
            data ={sizeArray}
            size={size}
        />
        ;

        pageNav =   <tr>
                        <td>{sizeDropDown}</td>
                        <td style={{textAlign:'center', width: '100%'}}>
                            <Col xs="auto" style={{textAlign:'center', width: '100%'}}>
                                <PageNav
                                  Page={page}
                                  MaxPage={maxpage}
                                  First={() => this.updatePageValue(1)}
                                  Back={() => this.updatePageValue(page-1)}
                                  Next={() => this.updatePageValue(page+1)}
                                  Last={() => this.updatePageValue(maxpage)}
                                />
                            </Col>
                        </td>
                        <td></td>
                    </tr>
        ;

        modal_message= <ModalMessage
          isOpen={this.state.modal_message}
          message={this.state.message}
          //code={this.state.code}
          onClick={() => this.toggle('message')}
          toggle={() => this.toggle('message')}
        />
        ;

        modal_add = <Modal

            isOpen={this.state.modal_nested_parent}
            toggle={() => this.toggle('nested_parent')}
            className={this.props.className}>

            <ModalHeader toggle={() => this.toggle('nested_parent')}>
                Tambah Generik
            </ModalHeader>

          <ModalBody>

              <Label>Generik</Label>

              <div className="input-group" style={{display: "inline-flex", alignItems: "center"}} >
                <Input type="generik" style={{width: "85%"}} value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namagenerik" placeholder="Generik" />
              </div>

              <br/>
              <br/>

              <Label>Aturan Pakai</Label>

              <Input type="textarea" style={{height: "100px"}}value={this.state.inputtedAturan} onChange={evt => this.updateInputValueAturan(evt)} name="aturanpakai" placeholder="Aturan Pakai" />

              <Label check style={{marginLeft: "20px"}}>
                  <Input type="checkbox" style={{display: "inline-flex", alignItems: "center"}} onClick={(e)=>this.checkPsikotropika(e)} /> Psikotropika
              </Label>

          </ModalBody>

          <ModalFooter>

              <Button color="primary" onClick={() => this.toggle('nested')}>
                Simpan
              </Button>
              {' '}
              <Button color="secondary" onClick={() => this.toggle('nested_parent')}>
                Batal
              </Button>

          </ModalFooter>

          <ModalConfirmation
            isOpen={this.state.modal_nested}
            toggle={() => this.toggle('nested')}
            onClick={() => this.insertMasterGenerik(this.state.inputtedName,this.state.inputtedAturan,this.state.gen_psikotropika)}
            header="Konfirmasi Penyimpanan"
            body={
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
            }
          />

        </Modal>
        ;

        modal_delete = <ModalConfirmation
          isOpen={this.state.modal_delete}
          toggle={() => this.toggle('delete')}
          onClick={() => this.deleteDataValue()}
          header="Konfirmasi Delete"
          body={
            <ModalBody>
              <br/>
              <b>Code: {this.state.gen_Code}</b><br/>
              <b>Nama Generik: {this.state.gen_Name}</b><br/><br/>
              Apakah anda ingin menghapus data ini?
            </ModalBody>
          }
        />
        ;

        modal_edit = <Modal

            isOpen={this.state.modal_edit}
            toggle={() => this.toggle('edit')}
            className={this.props.className}>

            <ModalHeader toggle={() => this.toggle('edit')}>
              Ubah Generik
            </ModalHeader>

          <ModalBody>

            <Label>Generik</Label>

            <div className="input-group" style={{display: "inline-flex", alignItems: "center"}} >
                <Input disabled={s_disable} style={{width: "10%"}} value={this.state.gen_Code} onChange={evt => this.updateInputValue(evt)} name="nogenerik" placeholder="No" />
                <Input disabled={s_disable} style={{width: "85%"}} value={this.state.gen_Name} onChange={evt => this.updateInputValue(evt)} name="namagenerik" placeholder="Generik" />
            </div>

            <br/>
            <br/>

            <Label>Aturan Pakai</Label>

            <Input type="textarea" style={{height: "100px"}} value={this.state.gen_Dosage} onChange={evt => this.updateInputValueUpdateDosage(evt)} name="aturanpakai" placeholder="Aturan Pakai" />

            <Label check style={{marginLeft: "20px"}}>
                <Input disabled={s_disable} type="checkbox" style={{display: "inline-flex", alignItems: "center"}} /> Psikotropika
            </Label>

          </ModalBody>

          <ModalFooter>

              <Button color="primary" onClick={() => this.toggle('nested')}>
                  Simpan
              </Button>
              {' '}
              <Button color="secondary" onClick={() => this.toggle('edit')}>
                  Batal
              </Button>

          </ModalFooter>

          <ModalConfirmation
            isOpen={this.state.modal_nested}
            toggle={() => this.toggle('nested')}
            onClick={() => this.updateGenerik()}
            header="Konfirmasi Penyimpanan"
            body={
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
            }
          />

        </Modal>
        ;

        modal_aturan = <Modal
            isOpen={this.state.modal_aturanPakai}
            toggle={() => this.toggle('aturanPakai')}
            className={this.props.className}>

            <ModalBody>

              <Label>Aturan Pakai</Label>

              <div className="input-group" style={{display: "inline-flex", alignItems: "center"}} >
                  <Input disabled style={{width: "10%"}} value={this.state.gen_Dosage} onChange={evt => this.updateInputValueAturan(evt)} name="aturanpakai" />
              </div>

            </ModalBody>

            <ModalFooter>
              <Button color="secondary" onClick={() => this.toggle('aturanPakai')}>
                Done
              </Button>
            </ModalFooter>

        </Modal>
        ;

        tableHead = <thead>
            <tr>

              <th width="10%">Code</th>
              <th width="65%">Name Generik</th>
              <th width="5%"></th>
              <th width="10px">Psikotropika</th>
              <th style={{marginLeft: "10px", float: "5px"}}> <Button color="primary" onClick={() => this.toggle('nested_parent')} style={{display: "inline-flex", alignItems: "center"}}><MdAdd style={{marginRight: "5px"}}></MdAdd>ADD</Button></th>

            </tr>
        </thead>
        ;

        tableBody = <tbody>
          {result.map(generik =>
            <tr>
                <th width ="10%" scope="row">{generik.gen_Code}</th>
                <th width="80%">{generik.gen_Name}</th>
                <Button size="sm" onClick={() => this.toggleAturanPakai(generik.gen_Code, generik.gen_Dosage)} style={{display: "inline-flex", alignItems: "center", marginLeft: "10px", marginTop: "10px"}}><MdInfo></MdInfo></Button>
                <th width="10%" style={{textAlign: "center"}}>{generik.gen_Psikotropika} </th>

                <th width="10%" style={{textAlign: "center"}}>
                  <Button size ="sm" onClick={() => this.toggleedit(generik.gen_Code, generik.gen_Name, generik.gen_Dosage, generik.gen_Psikotropika)} color="success" style={{display: "inline-flex", alignItems: "center", justifyContent: 'center'}}><MdEdit></MdEdit></Button>
                  <Button size ="sm" onClick={() => this.toggledelete(generik.gen_Code,generik.gen_Name)} color="danger" style={{display: "inline-flex", alignItems: "center", marginLeft: "10px"}}><MdDelete></MdDelete></Button>
                </th>

            </tr>
          )}
        </tbody>
        ;

        return (
            <Page
                title="Generik"
                breadcrumbs={[{ name: 'Generik', active: true }]}
                className="GenerikPage">

                {modal_message}
                {modal_add}
                {modal_delete}
                {modal_edit}
                {modal_aturan}

                <Card>
                    <CardHeader className="d-flex justify-content-between">
                            {search}
                    </CardHeader>

                    <CardBody className="mr-3">
                        <Table>
                            {tableHead}
                            {tableBody}
                        </Table>
                        {pageNav}
                    </CardBody>
                </Card>
            </Page>
        );
    }


}
export default GenerikPage;
//style={{display:"inline-block", width:"10 0px"}}