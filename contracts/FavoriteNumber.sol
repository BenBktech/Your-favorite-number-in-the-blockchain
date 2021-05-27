pragma solidity ^0.8.1;

contract FavoriteNumber {
    
    mapping(address => uint16) favoriteNumbers;
    uint index;
    
    event FavoriteNumberSet(address _address, uint16 _number);
    event FavoriteNumberGot(address _owner, uint16 _number);
    event NumberFavoriteNumbers(uint _number);
    
    function setFavoriteNumber(uint16 _number) public {
        require(_number < 65535, "Your favorite number is too big, choose a number under 65535");
        favoriteNumbers[msg.sender] = _number;
        index++;
        emit FavoriteNumberSet(msg.sender, _number);
    }
    
    function getFavoriteNumber(address _owner) public returns(uint16) {
        emit FavoriteNumberGot(_owner, favoriteNumbers[_owner]);
        return favoriteNumbers[_owner];
    }
    
    function howManyFavoriteNumbers() public returns(uint) {
        emit NumberFavoriteNumbers(index);
        return index;
    }
    
}