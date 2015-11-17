(function() {
      var _formData = {
        tags: [],
        question: 0,
        author: 'William',
        timeSubmitted: 0
      }

      var HelpRequestTab = React.createClass({
        sendRequest: function(e) {
          _formData.question = this.refs.question.value.trim()
          _formData.timeSubmitted = new Date();
          //EDIT THIS WILL!!!!!!!!!!!!!!  v
          e.preventDefault();
          // $.ajax({
          //   type: 'POST',
          //   url:,
          //   data:,
          //   success:,
          //   dataType:
          // })
        },
        render: function() {
          return (
            <div className="help">
              <input type="text" className='request-text' placeholder="Input your question here" ref='question'/>
              <SubmitTags /><br/>
              <button id='request-submit' onClick={this.sendRequest}>Submit Help Request</button>
            </div>
          );
        }
      });

      var SubmitTags = React.createClass({
        getInitialState: function() {
          return {
            inputData: [],
          };
        },
        handleSubmit: function (event) {
          event.preventDefault();
          console.log('pushing');

          this.state.inputData.push({key:this.refs.tag.value.trim(), text: this.refs.tag.value.trim()});
          _formData.tags.push(this.refs.tag.value.trim());
          console.log('formData is: ' + _formData);
          this.setState({
            inputData: this.state.inputData
          });

          console.log(this.state.inputData)
          this.refs.tag.value = '';
        },
        render: function () {
          return (
          <div className='submit-tags'>
          <form className="submit-tag" onSubmit={this.handleSubmit} >
            <input type="text" id='input' autoComplete="on" placeholder="Enter tags" ref="tag"/>
            <input type="submit" value="Add Tags" />
          </form> 
          <RenderTags data={this.state.inputData} />
          </div>
          );
        }
      });

      var RenderTags = React.createClass({
        closeTag: function (e) {
          // console.log(e)
          $(e.target).closest('div').remove();
          // console.log('current state : ' + JSON.stringify(this.state));
          //remove from the database as well
        },
        render: function () {
          var tagNodes = this.props.data.map(function(tag, idx) {
            return (
              <div className='chip' onClick={this.closeTag} key={idx}>{tag.text}
                <i className='material-icons'>close</i>
              </div>
              );
          }.bind(this))
          return (
            <div className="taglist">{tagNodes}</div>
          );
        }
      });

      ReactDOM.render(
        <HelpRequestTab className='help-request' />, document.getElementById('content')
      );
    })();
