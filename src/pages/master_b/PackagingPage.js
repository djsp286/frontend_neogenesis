import Page from 'components/Page';
import React from 'react';
import {
    Button, Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, Input, Label, InputGroup, InputGroupAddon, ButtonGroup, Form
} from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { MdDelete, MdSearch, MdLoyalty, MdAutorenew } from 'react-icons/md';

import * as myURL from '../urlLink'

class PackagingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            inputtedName: "",
            currentPage: 1,
            packingPerPage: 5,
            totalData: 0,
            flag: 0,
            firstRun: 0,
            searchType: "",
            keyword: "",
            lastPage: 1,
            statusDisableSearch: true,
            loading: false,
            enterButton: false,
        };

        this.clear = this.clear.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.toggle('nested_parent')
        this.getListbyPaging(this.state.currentPage, this.state.packingPerPage);
    }

    showNotification = (currMessage, levelType) => {
        setTimeout(() => {
            if (!this.notificationSystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdLoyalty />,
                message:
                    currMessage,
                level: levelType,
            });
        }, 100);
    }

    statusPanjangNamaKemasan = (input) => {
        if (input.length <= 25) {
            if (input.trim().length <= 0)
                return false;
            else
                return true;
        } else {
            return false;
        }
    }
    //set Current Limit
    handleSelect(event) {
        this.setState({
            currentPage: 1,
            result: [],
            packingPerPage: event.target.value
        });
        this.handleData(1, event.target.value);
    }

    handleData(currPage, currLimit, kword) {
        this.getListbyPaging(currPage, currLimit, kword);
    }

    //set Current Page
    handleWrite(event, flag) {
        if ((this.state.currentPage + flag) > 0 || this.state.currentPage === 0) {
            if ((Number(event.target.value) + flag) <= this.state.lastPage) {
                
                this.setState({
                    currentPage: Number(event.target.value) + flag
                },()=>this.handleData((this.state.currentPage), this.state.packingPerPage)
                );}
        }
        // console.log(this.state.currentPage);
        // console.log("ONCLICK  ",event.target.value + "    " + flag," curr+flag   ",this.state.currentPage + flag)
        // if ((this.state.currentPage + flag) !== 0 && (Number(event.target.value) + flag) <= this.state.lastPage) {
        //     this.handleData((this.state.currentPage + flag), this.state.packingPerPage);
        // }
        // console.log("YES BISA");
    }

    handleWritePagination(value, flag) {
        
        // console.log("lastPager  ",this.state.lastPage);
        
        if ((this.state.currentPage + flag) > 0 || this.state.currentPage === 0) {
            if ((Number(value) + flag) <= this.state.lastPage) {
                this.setState({
                    currentPage: Number(value) + flag
                },()=>this.handleData((this.state.currentPage), this.state.packingPerPage)
                );}
        }
        // console.log("YES BISA");
    }

    handleFirst(event) {
        this.setState({
            currentPage: 1
        });
        this.handleData(1, this.state.packingPerPage);
        console.log("YES BISA");
    }

    handleLast(event) {
        this.setState({
            currentPage: this.state.lastPage
        });
        this.handleData(this.state.lastPage, this.state.packingPerPage);
        console.log("YES BISA");
    }

    clear() {
        this.setState({
            currentPage: 0
        });
    }

    getListbyPaging(currPage, currLimit, kword) {
        const urlA = myURL.url_tampil_kemasan_limit

        console.log("currpage   ", currPage);
        
        var payload = {
            limit: currLimit,
            offset: (currPage - 1) * currLimit,
            keyword: kword
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }

        console.log(option);
        

        fetch(urlA, option)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }
                } else {
                    console.log(data);
                    
                    this.setState({
                        result: data["result"],
                        lastPage: (data["page"] === 0) ? 1 : data["page"],
                        loading: false
                    });

                }
            }).catch((err) => {
                console.log("ERROR2")
                this.showNotification("Koneksi ke server gagal!", 'error');
            }
            ).then(() => { this.setState({ loading: false }) });
    }

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            this.getListbyPaging(this.state.currentPage, this.state.packingPerPage);
        }
    }

    enterSearchPressed(event) {
        var code = event.keyCode || event.which;
        this.setState({ flagEnterSearch: false })
        if (code === 13) {
            event.preventDefault();
            this.setState({ currentPage: 1, flagEnterSearch: true });
            if (this.state.searchType === "pack_code") {
                if (!isNaN(this.state.keyword)) {
                    this.searchByCode();
                } else {
                    alert("Kode harus berupa angka")
                }
            }
            else if (this.state.searchType === "name") {
                this.searchByName(1, this.state.packingPerPage);
            }
        }
    }

    insertMasterKemasan = param => () => {
        if (this.statusPanjangNamaKemasan(param)) {
            var url_tambah_kemasan = url_tambah_kemasan;
            this.fetchData();
            var payload = {
                pack_name: param.trim(),
                pack_userid: "CONVERT",
            }
            fetch(myURL.url_tambah_kemasan, {
                method: "POST",
                body: JSON.stringify(payload),
                json: true,
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization": window.localStorage.getItem('tokenLogin')
                }
            }).then(response => response.json())
                .then(data => {
                    if (data.responseMessage === "TRUE") {
                        this.setState({
                            inputtedName: '',
                            modal_nested: false,
                            modal_nested_parent: false,
                            loading: false,
                            currentPage: 1,
                        });
                        this.handleData(1, this.state.packingPerPage);
                        this.showNotification(data.responseDescription, 'info');
                    } else {
                        this.setState({
                            inputtedName: '',
                            modal_nested: false,
                            modal_nested_parent: false,
                            loading: false,
                            currentPage: 1,
                        });
                        this.showNotification(data.responseDescription, 'error');
                        if(data.responseDescription.toLowerCase().includes("expired")){
                            window.localStorage.removeItem('tokenLogin');
                            window.localStorage.removeItem('accessList');
                            this.props.history.push({
                                pathname: '/login',
                              })
                        }
                    }
                });
        } else {
            alert("Nama kemasan tidak boleh kosong atau Panjang nama kemasan harus kurang dari 25");
        }
    }

    insertMasterShortcut = param => {
        if (this.statusPanjangNamaKemasan(param)) {
            var url_tambah_kemasan = url_tambah_kemasan;
            this.fetchData();
            this.setState({ enterButton: true })
            var payload = {
                pack_name: param.trim(),
                pack_userid: "CONVERT",
            }
            fetch(myURL.url_tambah_kemasan, {
                method: "POST",
                body: JSON.stringify(payload),
                json: true,
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization": window.localStorage.getItem('tokenLogin')
                },
            }).then(response => response.json())
                .then(data => {
                    if (data.responseMessage === "TRUE") {
                        this.setState({
                            inputtedName: '',
                            modal_nested: false,
                            modal_nested_parent: false,
                            loading: false,
                            currentPage: 1,
                            enterButton: false
                        });
                        this.handleData(1, this.state.packingPerPage);
                        this.showNotification(data.responseDescription, 'info');
                    } else {
                        this.setState({
                            inputtedName: '',
                            modal_nested: false,
                            modal_nested_parent: false,
                            loading: false,
                            currentPage: 1,
                            enterButton: false
                        });
                        this.showNotification(data.responseDescription, 'error');
                        if(data.responseDescription.toLowerCase().includes("expired")){
                            window.localStorage.removeItem('tokenLogin');
                            window.localStorage.removeItem('accessList');
                            this.props.history.push({
                                pathname: '/login',
                              })
                        }
                    }
                });
        } else {
            alert("Nama kemasan tidak boleh kosong atau Panjang nama kemasan harus kurang dari 25");
            { this.setState({ loading: false, enterButton: false }) };
        }
    }

    deletekemasan = (code, userid) => () => {
        var url = myURL.url_hapus_kemasan;
        this.fetchData();
        var payload = {
            code: code,
            user_id: userid,
            input: this.state.keyword,
            limit: this.state.packingPerPage,
        }

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    modal_delete: false,
                    modal_nested_delete: false,
                    modal_nested_parent_delete: false,
                    loading: false,
                });
                if (data.responseMessage === "TRUE") {
                    this.componentDidMount();
                    this.setState({ modal_delete: false })
                    this.handleData(this.state.currentPage, this.state.packingPerPage);

                    this.showNotification(data.responseDescription, 'info');
                } else {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }
                    
                }
            });
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateSearchValue(evt) {
        this.setState({
            keyword: evt.target.value
        }, () => {
            if (this.state.keyword.length === 0) {
                this.getListbyPaging(1, this.state.packingPerPage);
            }
        });
    }

    enterPressedSearch = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            this.setState({ currentPage: 1, realCurrentPage: 1 }
                , () => { this.getListbyPaging(this.state.currentPage, this.state.packingPerPage, this.state.keyword); });
        }
    }


    openModalWithItemID(code, user_id, name) {
        this.setState({
            modal_delete: true,
            activeCode: code,
            activeUserId: user_id,
            name_delete: name
        })
    }

    stateDropDown(status) {
        this.setState({
            dropdown_value: status
        })
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
        statusDisableSearch: true,
        selectedOption: 'ShowAll',
        flagEnterSearch: false
    };

    state = {
        modal_delete: false,
        modal_backdrop: false,
        modal_nested_parent_delete: false,
        modal_nested_delete: false,
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

    stateCurrentPage() {
        this.setState({ currentPage: 1 });
    }

    handleClose = () => {
        this.setState({ inputtedName: '' });
    }

    fetchData = () => {
        this.setState({ loading: true });
    };

    canBeSubmitted() {
        const { inputtedName } = this.state;
        return inputtedName.length > 0 && inputtedName.trim() !== "" && inputtedName.trim().length <= 25;
    }

    testFunc = (modalType) => {
        if (this.state.modal_nested_parent && this.state.modal_nested) {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                modal_nested: false
            });
        } else {
            if (!modalType) {
                return this.setState({
                    modal: !this.state.modal
                });
            }

            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

            });
        }
    }

    render() {
        const currentPacking = this.state.result;
        const { loading } = this.state;
        const isEnabled = this.canBeSubmitted();
        const renderPacking = currentPacking && currentPacking.map((packaging, i) => {
            return <tr key={i}>
                <th scope="row">{packaging.pack_code}</th>
                <td>{packaging.pack_name}</td>
                <td>
                    <Button color="secondary" size="sm" style={{ marginTop: '7px', background: "red", border: "none" }} onClick={() => this.openModalWithItemID(packaging.pack_code, packaging.pack_userid, packaging.pack_name)}><MdDelete /></Button>
                </td>
            </tr>
        });
        return (
            <Page
                title="Kemasan"
                breadcrumbs={[{ name: 'Kemasan', active: true }]}
                className="PackagingPage">
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
                                <Form inline className="cr-search-form" onSubmit={e => e.preventDefault()}>
                                    <MdSearch
                                        size="20"
                                        className="cr-search-form__icon-search text-secondary"
                                    />
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Search..."
                                        id="search"
                                        value={this.state.keyword}
                                        onChange={evt => this.updateSearchValue(evt)}
                                        onKeyPress={(event) => this.enterPressedSearch(event, true)}
                                    />
                                </Form>

                                <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                <Modal
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_parent}
                                    toggle={this.toggle('nested_parent')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Tambah Kemasan
                                </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Kemasan</Label>
                                        <Input type="namakemasan" autoComplete="off" id="unit" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namakemasan" placeholder="Nama Kemasan (maksimal 25 karakter)" />
                                        <br></br>
                                        <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button disabled={!isEnabled} color="primary" onClick={this.toggle('nested')}>
                                            Simpan
                                </Button>
                                        <Modal
                                            onExit={this.handleClose}
                                            isOpen={this.state.modal_nested}
                                            toggle={this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>
                                                <strong>Nama Kemasan: {this.state.inputtedName}</strong>
                                                <br />
                                                <br></br>
                                                Apakah Anda yakin ingin menyimpan data ini?
                                        </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={this.insertMasterKemasan(this.state.inputtedName)} disabled={loading}>
                                                    {!loading && <span>Ya</span>}
                                                    {loading && (
                                                        <MdAutorenew />
                                                    )}
                                                    {loading && <span>Sedang diproses</span>}
                                                </Button>{' '}
                                                {!loading && <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested')}>
                                                    Tidak
                                                </Button>}
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>

                                {/* delete */}
                                <Modal
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_delete}
                                    toggle={this.toggle('delete')}>
                                    <ModalHeader toggle={this.toggle('delete')}>Hapus Kemasan </ModalHeader>
                                    <ModalBody>
                                        <strong>ID: {this.state.activeCode}</strong>
                                        <br />
                                        <strong>Nama Kemasan: {this.state.name_delete}</strong>
                                        <br />
                                        <br></br>
                                        Apakah Anda yakin ingin menghapus data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.deletekemasan(this.state.activeCode, this.state.activeUserId)} disabled={loading}>
                                            {!loading && <span>Ya</span>}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && <span>Sedang diproses</span>}
                                        </Button>
                                        {!loading && <Button
                                            color="secondary"
                                            onClick={this.toggle('delete')}>
                                            Tidak
                                                </Button>}
                                    </ModalFooter>
                                </Modal>
                                {/* delete */}

                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <td colSpan='4' className="text-right" style={{ border: 'none' }}>
                                                <Label style={{ width: '50%', textAlign: 'left' }}>F1: Tambah, F3: Search</Label>
                                                <Label style={{ width: '50%', textAlign: 'right' }}> {'Halaman : ' + this.state.currentPage + ' / ' + this.state.lastPage}</Label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nama Kemasan</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderPacking}
                                        {!currentPacking && <tr>
                                            <td style={{ backgroundColor: 'white' }} colSpan='4' className="text-center">TIDAK ADA DATA</td>
                                        </tr>}
                                    </tbody>
                                </Table>
                            </CardBody>

                            {/* Set Pages */}
                            <CardBody>
                                <Row>
                                    <Col md="9" sm="12" xs="12">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend" >Tampilkan</InputGroupAddon>
                                            <select
                                                name="packingPerPage"
                                                style={{ height: '38px' }}
                                                value={this.state.value}
                                                onChange={(e) => this.handleSelect(e)}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </select>
                                            <InputGroupAddon addonType="prepend">Baris Per-Halaman</InputGroupAddon>
                                        </InputGroup>
                                    </Col>

                                    <Col md="3" sm="12" xs="12">
                                        <Card className="mb-3s">
                                            <ButtonGroup >
                                                <Button
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.handleFirst(e)}>
                                                    &#10092;&#10092;
                                            </Button>
                                                <Button
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.handleWrite(e, -1)}
                                                    disabled={!this.state.currentPage}>
                                                    &#10092;
                                            </Button>
                                                <Input
                                                    type="text"
                                                    placeholder="Page"
                                                    outline='none'
                                                    value={this.state.currentPage}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.handleWrite(e, 0)}
                                                    style={{ height: '38px', width: '75px', textAlign: 'center' }} />
                                                <Button
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.handleWrite(e, 1)}>
                                                    &#10093;
                                            </Button>

                                                <Button
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.handleLast(e)}>
                                                    &#10093;&#10093;
                                            </Button>
                                            </ButtonGroup>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <script>
                    {document.onkeydown = (e) => {
                        e = e || window.event;
                        if (e.ctrlKey) {
                            switch (e.key) {
                                //ctrl+s untuk modal simpan
                                case "s":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.testFunc("nested");
                                    } else if (this.state.modal_nested_parent_edit === true) {
                                        this.testFunc("nested_edit");
                                    }
                                    e.preventDefault();
                                    break;

                                case "S":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.testFunc("nested");
                                    } else if (this.state.modal_nested_parent_edit === true) {
                                        this.testFunc("nested_edit");
                                    }
                                    e.preventDefault();
                                    break;

                                //ctrl + kanan untuk last
                                case "ArrowRight":
                                    this.handleLast(e);
                                    e.preventDefault();
                                    break;

                                //ctrl + kiri untuk first
                                case "ArrowLeft":
                                    console.log("CC")
                                    this.handleFirst(e);
                                    e.preventDefault();
                                    break;
                            }
                        }
                        switch (e.key) {
                            //enter
                            case "Enter":
                                if (this.state.modal_nested === true && this.state.enterButton === false) { this.insertMasterShortcut(this.state.inputtedName) }
                                break;

                            // f1
                            case "F1":
                                this.testFunc("nested_parent");
                                console.log(this.state.modal_nested_parent);
                                document.getElementById("unit").focus();
                                e.preventDefault();
                                break;

                            //f3
                            case "F3":
                                // alert("untuk search");
                                document.getElementById("search").focus();
                                e.preventDefault();
                                break;

                            //kanan untuk next
                            case "ArrowRight":
                                if (e.ctrlKey === false) {
                                    this.handleWritePagination(this.state.currentPage, 1);
                                    console.log("AA")
                                }
                                e.preventDefault();
                                break;

                            //kiri untuk prev
                            case "ArrowLeft":
                                if (e.ctrlKey === false) {
                                    this.handleWritePagination(this.state.currentPage, -1);
                                    console.log("BB")
                                }
                                e.preventDefault();
                                break;

                        }
                        //menghilangkan fungsi default tombol
                        // e.preventDefault();
                    }}
                </script>
            </Page>
        );
    }
}
export default PackagingPage;