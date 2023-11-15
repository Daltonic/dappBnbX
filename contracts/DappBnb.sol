// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract DappBnb is Ownable, ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _totalAppartments;

  struct ApartmentStruct {
    uint id;
    string name;
    string description;
    string location;
    string images;
    uint rooms;
    uint price;
    address owner;
    bool booked;
    bool deleted;
    uint timestamp;
  }

  struct BookingStruct {
    uint id;
    uint aid;
    address tenant;
    uint date;
    uint price;
    bool checked;
    bool cancelled;
  }

  struct ReviewStruct {
    uint id;
    uint aid;
    string reviewText;
    uint timestamp;
    address owner;
  }

  uint public securityFee;
  uint public taxPercent;

  mapping(uint => ApartmentStruct) apartments;
  mapping(uint => BookingStruct[]) bookingsOf;
  mapping(uint => ReviewStruct[]) reviewsOf;
  mapping(uint => bool) appartmentExist;
  mapping(uint => uint[]) bookedDates;
  mapping(uint => mapping(uint => bool)) isDateBooked;
  mapping(address => mapping(uint => bool)) hasBooked;

  constructor(uint _taxPercent, uint _securityFee) {
    taxPercent = _taxPercent;
    securityFee = _securityFee;
  }

  function createAppartment(
    string memory name,
    string memory description,
    string memory location,
    string memory images,
    uint rooms,
    uint price
  ) public {
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(location).length > 0, 'Location cannot be empty');
    require(bytes(images).length > 0, 'Images cannot be empty');
    require(rooms > 0, 'Rooms cannot be zero');
    require(price > 0 ether, 'Price cannot be zero');

    _totalAppartments.increment();
    ApartmentStruct memory lodge;
    lodge.id = _totalAppartments.current();
    lodge.name = name;
    lodge.description = description;
    lodge.location = location;
    lodge.images = images;
    lodge.rooms = rooms;
    lodge.price = price;
    lodge.owner = msg.sender;
    lodge.timestamp = currentTime();

    appartmentExist[lodge.id] = true;
    apartments[_totalAppartments.current()] = lodge;
  }

  function updateAppartment(
    uint id,
    string memory name,
    string memory description,
    string memory location,
    string memory images,
    uint rooms,
    uint price
  ) public {
    require(appartmentExist[id] == true, 'Appartment not found');
    require(msg.sender == apartments[id].owner, 'Unauthorized personnel, owner only');
    require(bytes(name).length > 0, 'Name cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(location).length > 0, 'Location cannot be empty');
    require(bytes(images).length > 0, 'Images cannot be empty');
    require(rooms > 0, 'Rooms cannot be zero');
    require(price > 0 ether, 'Price cannot be zero');

    ApartmentStruct memory lodge = apartments[id];
    lodge.name = name;
    lodge.description = description;
    lodge.location = location;
    lodge.images = images;
    lodge.rooms = rooms;
    lodge.price = price;

    apartments[id] = lodge;
  }

  function deleteAppartment(uint id) public {
    require(appartmentExist[id] == true, 'Appartment not found');
    require(apartments[id].owner == msg.sender, 'Unauthorized entity');

    appartmentExist[id] = false;
    apartments[id].deleted = true;
  }

  function getApartments() public view returns (ApartmentStruct[] memory Apartments) {
    uint256 available;
    for (uint i = 1; i <= _totalAppartments.current(); i++) {
      if (!apartments[i].deleted) available++;
    }

    Apartments = new ApartmentStruct[](available);

    uint256 index;
    for (uint i = 1; i <= _totalAppartments.current(); i++) {
      if (!apartments[i].deleted) {
        Apartments[index++] = apartments[i];
      }
    }
  }

  function getApartment(uint id) public view returns (ApartmentStruct memory) {
    return apartments[id];
  }

  function bookApartment(uint aid, uint[] memory dates) public payable {
    require(appartmentExist[aid], 'Apartment not found!');
    require(
      msg.value >=
        (apartments[aid].price * dates.length) +
          (((apartments[aid].price * dates.length) * securityFee) / 100),
      'Insufficient fund!'
    );
    require(datesAreCleared(aid, dates), 'Booked date found among dates!');

    for (uint i = 0; i < dates.length; i++) {
      BookingStruct memory booking;
      booking.aid = aid;
      booking.id = bookingsOf[aid].length;
      booking.tenant = msg.sender;
      booking.date = dates[i];
      booking.price = apartments[aid].price;
      bookingsOf[aid].push(booking);
      isDateBooked[aid][dates[i]] = true;
      bookedDates[aid].push(dates[i]);
    }
  }

  function datesAreCleared(uint aid, uint[] memory dates) internal view returns (bool) {
    bool lastCheck = true;
    for (uint i = 0; i < dates.length; i++) {
      for (uint j = 0; j < bookedDates[aid].length; j++) {
        if (dates[i] == bookedDates[aid][j]) lastCheck = false;
      }
    }
    return lastCheck;
  }

  function checkInApartment(uint aid, uint bookingId) public {
    BookingStruct memory booking = bookingsOf[aid][bookingId];
    require(msg.sender == booking.tenant, 'Unauthorized tenant!');
    require(!booking.checked, 'Apartment already checked on this date!');

    bookingsOf[aid][bookingId].checked = true;
    uint tax = (booking.price * taxPercent) / 100;
    uint fee = (booking.price * securityFee) / 100;

    hasBooked[msg.sender][aid] = true;

    payTo(apartments[aid].owner, (booking.price - tax));
    payTo(owner(), tax);
    payTo(msg.sender, fee);
  }

  function claimFunds(uint aid, uint bookingId) public {
    require(msg.sender == apartments[aid].owner, 'Unauthorized entity');
    require(!bookingsOf[aid][bookingId].checked, 'Apartment already checked on this date!');

    uint price = bookingsOf[aid][bookingId].price;
    uint fee = (price * taxPercent) / 100;

    payTo(apartments[aid].owner, (price - fee));
    payTo(owner(), fee);
    payTo(msg.sender, securityFee);
  }

  function refundBooking(uint aid, uint bookingId) public nonReentrant {
    BookingStruct memory booking = bookingsOf[aid][bookingId];
    require(!booking.checked, 'Apartment already checked on this date!');
    require(isDateBooked[aid][booking.date], 'Did not book on this date!');

    if (msg.sender != owner()) {
      require(msg.sender == booking.tenant, 'Unauthorized tenant!');
      require(booking.date > currentTime(), 'Can no longer refund, booking date started');
    }

    bookingsOf[aid][bookingId].cancelled = true;
    isDateBooked[aid][booking.date] = false;

    uint lastIndex = bookedDates[aid].length - 1;
    uint lastBookingId = bookedDates[aid][lastIndex];
    bookedDates[aid][bookingId] = lastBookingId;
    bookedDates[aid].pop();

    uint fee = (booking.price * securityFee) / 100;
    uint collateral = fee / 2;

    payTo(apartments[aid].owner, collateral);
    payTo(owner(), collateral);
    payTo(msg.sender, booking.price);
  }

  function getUnavailableDates(uint aid) public view returns (uint[] memory) {
    return bookedDates[aid];
  }

  function getBookings(uint aid) public view returns (BookingStruct[] memory) {
    return bookingsOf[aid];
  }

  function getQualifiedReviewers(uint aid) public view returns (address[] memory Tenants) {
    uint256 available;
    for (uint i = 0; i < bookingsOf[aid].length; i++) {
      if (bookingsOf[aid][i].checked) available++;
    }

    Tenants = new address[](available);

    uint256 index;
    for (uint i = 0; i < bookingsOf[aid].length; i++) {
      if (bookingsOf[aid][i].checked) {
        Tenants[index++] = bookingsOf[aid][i].tenant;
      }
    }
  }

  function getBooking(uint aid, uint bookingId) public view returns (BookingStruct memory) {
    return bookingsOf[aid][bookingId];
  }

  function payTo(address to, uint256 amount) internal {
    (bool success, ) = payable(to).call{ value: amount }('');
    require(success);
  }

  function addReview(uint aid, string memory reviewText) public {
    require(appartmentExist[aid], 'Appartment not available');
    require(hasBooked[msg.sender][aid], 'Book first before review');
    require(bytes(reviewText).length > 0, 'Review text cannot be empty');

    ReviewStruct memory review;

    review.aid = aid;
    review.id = reviewsOf[aid].length;
    review.reviewText = reviewText;
    review.timestamp = currentTime();
    review.owner = msg.sender;

    reviewsOf[aid].push(review);
  }

  function getReviews(uint aid) public view returns (ReviewStruct[] memory) {
    return reviewsOf[aid];
  }

  function tenantBooked(uint appartmentId) public view returns (bool) {
    return hasBooked[msg.sender][appartmentId];
  }

  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }
}
