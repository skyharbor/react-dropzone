import React from 'react'
import accept from 'attr-accept'

export default class Dropzone extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isDragActive: false }

    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  allFilesAccepted(files) {
    return files.every(file =>  accept(file, this.props.accept))
  }

  onDragEnter(e) {
    e.preventDefault()

    var dataTransferItems = Array.prototype.slice.call(e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items : [])
    var allFilesAccepted = this.allFilesAccepted(dataTransferItems)

    this.setState({
      isDragActive: allFilesAccepted,
      isDragReject: !allFilesAccepted
    })

    if (this.props.onDragEnter) {
      this.props.onDragEnter(e)
    }
  }

  onDragOver(e) {
    e.preventDefault()
  }

  onDragLeave(e) {
    e.preventDefault()

    this.setState({
      isDragActive: false,
      isDragReject: false
    })

    if (this.props.onDragLeave) {
      this.props.onDragLeave(e)
    }
  }

  onDrop(e) {
    e.preventDefault()

    this.setState({
      isDragActive: false,
      isDragReject: false
    })

    var droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files
    var max = this.props.multiple ? droppedFiles.length : 1
    var files = []

    for (var i = 0; i < max; i++) {
      var file = droppedFiles[i]
      file.preview = URL.createObjectURL(file)
      files.push(file)
    }

    if (this.props.onDrop) {
      this.props.onDrop(files, e)
    }

    if (this.allFilesAccepted(files)) {
      if (this.props.onDropAccepted) {
        this.props.onDropAccepted(files, e);
      }
    } else {
      if (this.props.onDropRejected) {
        this.props.onDropRejected(files, e);
      }
    }
  }

  onClick() {
    if (!this.props.disableClick) {
      this.open()
    }
  }

  open() {
    var fileInput = React.findDOMNode(this.refs.fileInput)
    fileInput.value = null
    fileInput.click()
  }

  render() {
    var className
    if (this.props.className) {
      className = this.props.className
      if (this.state.isDragActive) {
        className += ' ' + this.props.activeClassName
      }
      if (this.state.isDragReject) {
        className += ' ' + this.props.rejectClassName
      }
    }

    var style
    var activeStyle
    if (this.props.style) {
      style = this.props.style
      activeStyle = this.props.activeStyle
    } else if (!className) {
      style = {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5,
      }
      activeStyle = {
        borderStyle: 'solid',
        backgroundColor: '#eee'
      }
    }

    var appliedStyle
    if (style && this.state.isDragActive) {
      appliedStyle = {
        ...style,
        ...activeStyle
      }
    } else {
      appliedStyle = {
        ...style
      }
    }

    return (
      <div
        className={className}
        style={appliedStyle}
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {this.props.children}
        <input
          type='file'
          ref='fileInput'
          style={{ display: 'none' }}
          multiple={this.props.multiple}
          accept={this.props.accept}
          onChange={this.onDrop}
        />
      </div>
    )
  }
}

Dropzone.defaultProps = {
  disableClick: false,
  multiple: true
}

Dropzone.propTypes = {
  onDrop: React.PropTypes.func.isRequired,
  onDropAccepted: React.PropTypes.func,
  onDropRejected: React.PropTypes.func,
  onDragEnter: React.PropTypes.func,
  onDragLeave: React.PropTypes.func,

  style: React.PropTypes.object,
  activeStyle: React.PropTypes.object,
  className: React.PropTypes.string,
  activeClassName: React.PropTypes.string,

  disableClick: React.PropTypes.bool,
  multiple: React.PropTypes.bool,
  accept: React.PropTypes.string
}
