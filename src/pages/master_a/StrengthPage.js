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
import { MdAdd, MdDelete, MdSearch } from 'react-icons/md';
import * as s_url from '../urlLinkMasterA';
import * as Request from '../../custom_functions/Request';
import SizeDropDown from '../../custom_components/SizeDropDown';
import ModalMessage from '../../custom_components/ModalMessage';
import ModalConfirmation from '../../custom_components/ModalConfirmation';
import PageNav from '../../custom_components/PageNav';

class StrengthPage extends React.Component {

    constructor(props) {
        super(props);
        
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.state = {
            result: [],
            isLoading: false,
            inputtedName: '',
            searchType: "",
            keyword: "",
            selectedDropdown:"All",
            page: 1,
            size: 10,
            count: 0,
            str_code:0,
            str_nama:"",

            modal: false,
            modal_backdrop: false,
            modal_nested_parent: false,
            modal_nested: false,
            modal_delete: false,
            modal_edit: false,
            modal_message: false,
            backdrop: true,
            dropdownOpen: false,
        };
    }

    //request
    pageCount(){
        var  url = s_url.url_CetakStrength_Count;

        if( this.state.searchType === "Strength_Kode"){url = s_url.url_PencarianStrengthKode_Count;}
        if( this.state.searchType === "Strength_Nama"){url = s_url.url_PencarianStrengthNama_Count;}
        if(url === s_url.url_CetakStrength_Count){

            Request.Get(
                url,

                data => {
                    this.setState({ count: data.responseCount },
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

        var  url = s_url.url_CetakStrength_Halaman;

        if( this.state.searchType === "Strength_Kode"){url = s_url.url_PencarianStrengthKode_Halaman;}
        if( this.state.searchType === "Strength_Nama"){url = s_url.url_PencarianStrengthNama_Halaman;}

        this.setState({ isLoading: true });
        var formdata = {
            page: page,
            size: size,
            keyword:(this.state.keyword).trim()//ignored in CetakStrength
        };

        Request.Post(
            url,
            formdata,
            data =>
            {

                  this.setState({ result: data.responseData ,
                      page: page,
                      isLoading: false}
                  );

            },
            () => this.popUpMessage("cannot reach the server",false),
            () => this.popUpMessage("cannot reach the server",false)
        );

    }

    insertMasterStrength(param){
        // var url = `http://pharmanet.apodoc.id/neogenesisInsertMasterUnit.php?unit_name=${param}&unit_userid=0`;
        var url = s_url.url_TambahStrength;
        var payload = {
            Strength_Name: param,
            Strength_UserID: "COVERT"
        };

        Request.Post(
            url,
            payload,

            data => this.popUpMessage(data.responseMessage,true),

            () => this.popUpMessage("cannot reach the server",false),
            () => this.popUpMessage("cannot reach the server",false)
        );

    }

    deleteDataValue () {
        var url = s_url.url_HapusStrength;
        var payload = {
            strg_code: this.state.str_code,
            strg_userid: "COVERT"
        };

        Request.Post(
            url,
            payload,

            data => this.popUpMessage(data.responseMessage,true),

            () => this.popUpMessage("cannot reach the server",false),
            () => this.popUpMessage("cannot reach the server",false)
        );

    }

    //initial
    componentDidMount() {
        this.pageCount();
    }

    //update data
    updateSelectionValue(evt){
        this.setState({
            selectedDropdown: evt.target.value
        },() => {
            if(this.state.selectedDropdown === "All"){
                this.setState({ searchType:"Show_All",
                    page : 1},() => this.pageCount())

            }
        });

    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value,
        });
    }

    updateSearchValue(evt){
        //console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    updateSizeValue(evt){
            this.setState({size : evt.target.value},
                () => 
                this.pageCount()
                );

    }

    updatePageValue(number){
        this.setState({page : number},
            () => 
            this.pageCount()
            );
    }

    //toggle
    toggleDropDown() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
      }

    toggle(modalType){
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    toggledelete(code,nama){
        this.setState({
            modal_delete:true,
            str_code:code,
            str_nama:nama
        })
    }

    //other method
    enterPressed(evt){
        var code = evt.keyCode || evt.which;
        if (code === 13){ //13 adalah kode untuk keyword
            this.searchPage()
        }
    }

    searchPage(){
        var search = "";
        if(this.state.selectedDropdown==="Kode"){search = "Strength_Kode";}
        if(this.state.selectedDropdown==="Nama"){search = "Strength_Nama";}
        if(this.state.selectedDropdown==="All" ){search = "Show_All";}

        this.setState({searchType:search,page : 1},() => this.pageCount())
    }

    popUpMessage(message,render){
        if(render){

            this.setState({
                message: message,
                modal_delete: false,
                modal_nested: false,
                modal_nested_parent: false,
                modal_message:true,
                searchType:"Show_All"

            },  () => this.pageCount())

        }else{

            this.setState({
                message: message,
                modal_delete: false,
                modal_nested: false,
                modal_nested_parent: false,
                modal_message:true,
                searchType:"Show_All"

            })

        }
    }

    //render
    render() {
        const { result, isLoading, page, count, size } = this.state;
        console.log(result);
        console.log(count);
        const maxpage = Math.ceil(count/size);
        var search, sizeDropDown, pageNav;
        var s_disable = false;
        var sizeArray = [3,5,10,25];
        var modal_message,modal_add,modal_delete;
        var tableHead,tableBody;

        if(this.state.selectedDropdown === "All"){
            s_disable = true;
        }
        
        search =    <InputGroup style={{marginRight:"5px"}}>
                        <InputGroupButtonDropdown style={{marginRight:"10px"}}  color="primary" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                            <DropdownToggle caret>{this.state.selectedDropdown}</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem value="All"  onClick={evt => this.updateSelectionValue(evt)}>SHOW ALL</DropdownItem>
                                    <DropdownItem value="Kode" onClick={evt => this.updateSelectionValue(evt)}>KODE STRENGTH</DropdownItem>
                                    <DropdownItem value="Nama" onClick={evt => this.updateSelectionValue(evt)}>NAMA STRENGTH</DropdownItem>
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
                    </tr>
        ;

        modal_message = <ModalMessage
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
                  Tambah Strength
              </ModalHeader>

              <ModalBody>
                  <Label>Nama Strength</Label>
                  <Input type="namastrength" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namastrength" placeholder="Nama Strength" />
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
                onClick={() => this.insertMasterStrength(this.state.inputtedName)}
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
                  <b>no. produk: {this.state.str_code}</b><br/>
                  <b>nama produk: {this.state.str_nama}</b><br/><br/>
                  Apakah anda ingin menghapus data ini?
              </ModalBody>
          }
        />;

        tableHead =
          <thead >
              <tr >
                  <th width="10%">Code</th>
                  <th width="80%">Name Strength</th>
                  <th style={{marginRight: "5px"}}> <Button size="sm" color="primary" onClick={() => this.toggle('nested_parent')} style={{display: "inline-flex", alignItems: "center"}}><MdAdd style={{marginRight: "5px"}}></MdAdd>ADD</Button></th>
              </tr>
          </thead>
        ;

        tableBody =
          <tbody>
          {result.map(strength =>
            <tr >
                <th width ="10%" scope="row">{strength.strg_Code}</th>
                <th width="80%">{strength.strg_Name}</th>
                <th width="10%" style={{textAlign: "center"}}>   <Button size ="sm" onClick={() => this.toggledelete(strength.strg_Code,strength.strg_Name)} color="danger" style={{display: "inline-flex", alignItems: "center"}}><MdDelete></MdDelete></Button></th>
            </tr>
          )}
          </tbody>
        ;
        
        return (
            <Page
                title="Strength"
                breadcrumbs={[{ name: 'Strength', active: true }]}
                className="StrengthPage">

                {modal_message}
                {modal_add}
                {modal_delete}

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
export default StrengthPage;
//style={{display:"inline-block", width:"10 0px"}}